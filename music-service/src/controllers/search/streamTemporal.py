import yt_dlp


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
    return {"audio_url": audio_url}
