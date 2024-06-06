import json
import subprocess
from models.charts import GenCharts
from utils.functions import format_duration


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
        output = subprocess.check_output(command).decode("utf-8")
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

        print(simplified_results)
        return simplified_results

    except subprocess.CalledProcessError:
        return []


def format_artist_and_title(payload: GenCharts):
    result: list[str] = []

    for value in payload.payload:
        string = value["title"] + " " + value["artist"]
        result.append(string)

    return result


def delete_previous_chart(chart_type: str):
    delete_previous_chart = open("./data/" + chart_type + "-chart.json", "w")
    delete_previous_chart.truncate(0)


def populate_raw_chart(formatted_input: list[str]) -> list[dict[str, str]]:
    raw_chart = []

    for song in formatted_input:
        raw_chart.append(search_songs(song))

    return raw_chart


def find_most_popular(raw_chart):
    polished_chart: list[dict[str, str]] = []

    for chart in raw_chart:
        find_most_popular = {}
        temp_highest = 0

        for song in chart:
            if song["view_count"] > temp_highest:
                temp_highest = song["view_count"]
                find_most_popular = song

        polished_chart.append(find_most_popular)

    return polished_chart


def save_new_chart(polished_chart: list[dict[str, str]], chart_type: str) -> None:
    with open("./data/" + chart_type + "-chart.json", "w") as f:
        json.dump(polished_chart, f)


def create_top_chart(payload: GenCharts) -> dict[str, list[dict[str, str]]]:
    chart_type = payload.chartType

    delete_previous_chart(chart_type)

    formatted_input = format_artist_and_title(payload)

    raw_chart = populate_raw_chart(formatted_input)

    popular_chart = find_most_popular(raw_chart)

    save_new_chart(popular_chart, chart_type)

    return {"message": "success", "result": popular_chart}
