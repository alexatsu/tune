import yt_dlp
import re

opts = {
    "ignoreerrors": True,
}

URLS = [
    "https://www.youtube.com/watch?v=qH3fETPsqXU",
    "https://www.youtube.com/watch?v=tNkZsRW7h2c",
    "https://www.youtube.com/watch?v=ehTuatSx5Wc",
    "https://www.youtube.com/watch?v=5yx6BWlEVcY",
    "https://www.youtube.com/watch?v=lP26UCnoH9s",
    "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    "https://www.youtube.com/watch?v=7NOSDKb0HlU",
    "https://www.youtube.com/watch?v=rPjez8z61rI",
]


def extract_chill_streams():
    result = []

    for i in range(0, len(URLS)):
        with yt_dlp.YoutubeDL(opts) as ydl:
            video_results = ydl.extract_info(URLS[i], download=False)

            title_without_date_and_time = re.sub(
                r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}", "", video_results["title"]
            ).strip()

            data = {
                "urlId": video_results["id"],
                "title": title_without_date_and_time,
                "cover": video_results.get("thumbnail", None),
                "url": video_results["original_url"],
            }

            result.append(data)

    return result
