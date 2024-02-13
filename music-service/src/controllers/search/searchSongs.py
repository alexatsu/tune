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

            get_songs_data = []
            for video in video_entries:                
                try:
                    song_data = {
                        "id": video["id"],
                        "title": video["title"],
                        "url": video["original_url"],
                        "cover": video.get("thumbnail", None),
                        "duration": format_duration(video.get("duration", None)),
                    }
                    get_songs_data.append(song_data)

                except Exception as e:
                    print(f"Error processing song: {e}")
                    continue  # Skip to the next song

            return {"songs": get_songs_data, "music_type": "search"}
