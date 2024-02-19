from fastapi import Response
import yt_dlp
from fastapi.responses import RedirectResponse


def streamTemporal(url):
    print(url)
    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],
    }

    ydl = yt_dlp.YoutubeDL(ydl_opts)
    info_dict = ydl.extract_info(url, download=False)
    audio_url = info_dict["url"]
    return RedirectResponse(audio_url, status_code=307, headers={"location": audio_url})
