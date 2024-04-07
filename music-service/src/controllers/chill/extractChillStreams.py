import yt_dlp


opts = {
    "ignoreerrors": True,
}

URLS = [
    "https://www.youtube.com/watch?v=BaW_jenozKc",
    "https://www.youtube.com/watch?v=2J-8iMNYSyQ",
]


def extract_chill_streams():
    result = []

    for url in URLS:
        with yt_dlp.YoutubeDL(opts) as ydl:
            video_results = ydl.extract_info(url, download=False)
            data = {
                "id": video_results["id"],
                "title": video_results["title"],
                "cover": video_results.get("thumbnail", None),
            }

            result.append(data)

    return result
