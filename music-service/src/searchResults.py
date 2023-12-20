import json
import yt_dlp
from models.audio import Search


def format_duration(duration: int) -> str:
    hours = (duration / 60) / 60
    minutes = (duration / 60) % 60
    seconds = duration % 60
    return f"{int(hours)}:{int(minutes)}:{int(seconds)}"


query = "Barren Gates Obey"
data = {}


def search_songs(query: Search):
    with yt_dlp.YoutubeDL(data) as ydl:
        videoResults = ydl.extract_info(f"ytsearch5:{query}", download=False)

        if videoResults:
            videoEntries: list = videoResults["entries"]

            getSongsData = list(
                map(
                    lambda video: {
                        "id": video["id"],
                        "title": video["title"],
                        "url": video["original_url"],
                        "cover": video.get("thumbnail", None),
                        "duration": format_duration(video.get("duration", None)),
                    },
                    videoEntries,
                )
            )
            with open("searchResults.json", "w") as f:
                json.dump(getSongsData, f)
            return getSongsData


search_songs(query)
