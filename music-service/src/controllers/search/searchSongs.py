import json
import subprocess
from models.audio import Search
from utils.functions import format_duration


def search_songs(query: Search):
    command = [
        "yt-dlp",
        "ytsearch{}:{}".format(5, query),
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
        videos = [json.loads(line) for line in output.splitlines()]
        # Simplify the results for displaying to the user
        simplified_results = []
        for video in videos:

            duration = video.get("duration")

            if duration is not None:
                simplified_results.append(
                    {
                        "title": video.get("title", "N/A"),
                        "urlId": video.get("id", "N/A"),
                        "url": video.get("original_url", "N/A"),
                        "duration": format_duration(video.get("duration")),
                        "cover": video.get("thumbnails", "N/A")[0].get("url", "N/A"),
                    }
                )

        print(simplified_results)
        return {"songs": simplified_results, "music_type": "search"}

    except subprocess.CalledProcessError:
        return []
