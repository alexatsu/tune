import json
import os
import subprocess

import requests
from models.charts import GenCharts
from utils.functions import format_duration

folder = "./temp"


def search_songs(input: str):
    command = [
        "yt-dlp",
        "ytsearch{}:{}".format(5, input),
        "--dump-json",
        "--default-search",
        "--no-playlist",
        "--no-check-certificate",
        "--geo-bypass",
        "--flat-playlist",
        "--skip-download",
        "--quiet",
        "--ignore-errors",
    ]
    try:
        # Get the output and analyze it
        output = subprocess.check_output(command, timeout=10).decode("utf-8")
        videos: list[str] = [json.loads(line) for line in output.splitlines()]

        # Simplify the results for displaying to the user
        simplified_results = []

        for video in videos:
            duration: str = video.get("duration")
            if duration is not None:
                simplified_results.append(
                    {
                        "title": video.get("title", "N/A"),
                        "urlId": video.get("id", "N/A"),
                        "url": video.get("original_url", "N/A"),
                        "duration": format_duration(video.get("duration")),
                        "cover": video.get("thumbnails", "N/A")[0].get("url", "N/A"),
                        "view_count": video.get("view_count", "N/A"),
                    }
                )

        # print(simplified_results)
        return simplified_results

    except subprocess.CalledProcessError:
        return []
    except subprocess.TimeoutExpired:
        print("Subprocess timed out")
        return []


def format_artist_and_title(chart: list[dict[str, str]]) -> list[str]:
    result: list[str] = []
    for value in chart:
        string = value["title"] + " " + value["artist"]
        result.append(string)

    return result


def populate_raw_chart(formatted_input: list[str]) -> list[dict[str, str]]:
    raw_chart = []

    for song in formatted_input:
        raw_chart.append(search_songs(song))

    return raw_chart


def find_most_popular(raw_chart: list[dict[str, str]]) -> list[dict[str, str]]:
    polished_chart: list[dict[str, str]] = []

    for chart in raw_chart:
        find_most_popular = {}
        temp_highest = 0

        for song in chart:
            if int(song["view_count"]) > temp_highest:
                temp_highest = int(song["view_count"])
                find_most_popular = song

        polished_chart.append(find_most_popular)

    return polished_chart


def save_new_chart(polished_chart: list[dict[str, str]], chart_type: str) -> None:
    with open(folder + "/" + chart_type + "-chart.json", "w") as f:
        json.dump(polished_chart, f)


def create_top_chart(
    chart: list[dict[str, str]], chart_type: str
) -> dict[str, list[dict[str, str]]]:
    formatted_input = format_artist_and_title(chart)

    raw_chart = populate_raw_chart(formatted_input)

    popular_chart = find_most_popular(raw_chart)

    save_new_chart(popular_chart, chart_type)

    return {"message": "success", "result": popular_chart}


def iterate_over_charts(payload: GenCharts) -> None:
    print("iterating over charts")
    for key in payload.payload:
        create_top_chart(payload.payload[key], key)

    print("Charts created successfully")


def delete_stored_charts() -> None:

    print("Charts deleted successfully")
    current_file_path = os.path.abspath(__file__)
    root_folder = os.path.dirname(current_file_path)

    # root folder in the github repo is "charts-service" but in docker it is "app"
    while os.path.basename(root_folder) != "app":
        root_folder = os.path.dirname(root_folder)

    folder = os.path.join(root_folder, "temp")

    for filename in os.listdir(folder):
        if filename.endswith(".json"):
            os.remove(os.path.join(folder, filename))


def merge_json_charts() -> None:
    print("merging json charts")
    merged_charts = {}

    for filename in os.listdir(folder):
        if filename.endswith(".json"):
            with open(os.path.join(folder, filename), "r") as f:
                chart_name = filename.split(".")[0]
                merged_charts[chart_name] = json.load(f)

    with open(folder + "/all-charts.json", "w") as f:
        json.dump(merged_charts, f)


def send_charts_to_parser():
    print("sending charts to parser")
    container_prod = os.environ.get("PARSER_SERVICE_CONTAINER")
    container_local = "http://parser-service:8020"
    is_production = os.environ.get("NODE_ENV") == "production"

    url = (
        container_prod
        if is_production
        else container_local + "/charts/retrieve-processed"
    )

    headers = {
        "Content-Type": "application/json",
    }

    data = {}

    with open(folder + "/all-charts.json", "r") as f:
        data = json.load(f)

    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        if response.status_code == 200:
            print("Request sent successfully")
            body = response.json()
            return body
        else:
            print(f"Request failed with status code {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None


def generate_charts(payload: GenCharts) -> dict[str, list[dict[str, str]]]:
    iterate_over_charts(payload)
    merge_json_charts()
    send_charts_to_parser()
    delete_stored_charts()
    print("Charts generated successfully and sent to parser")
    return {"message": "success"}
