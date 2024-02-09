import yt_dlp

from models.audio import Search
from utils.functions import format_duration


data = {
    "ignoreerrors": True,
}


def search_songs(query: Search):
    with yt_dlp.YoutubeDL(data) as ydl:
        video_results = ydl.extract_info(f"ytsearch5:{query}", download=False)

        if video_results:
            video_entries: list = video_results["entries"]

            get_songs_data = list(
                map(
                    lambda video: {
                        "id": video["id"],
                        "title": video["title"],
                        "url": video["original_url"],
                        "cover": video.get("thumbnail", None),
                        "duration": format_duration(video.get("duration", None)),
                    },
                    video_entries,
                )
            )

            return {"songs": get_songs_data, "music_type": "search"}
