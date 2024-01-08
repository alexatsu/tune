import subprocess
import os
import yt_dlp
import requests


def download_track(url: str, path: str):
    URLS = [url]

    ydl_opts = {
        "format": "m4a/bestaudio/best",
        "covers": True,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "aac",
            }
        ],
        "outtmpl": f"audio/{path}/%(title)s.m4a",
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl_info:
        ydl_info.download(URLS)
        filenames = [
            ydl_info.prepare_filename(ydl_info.extract_info(url, download=False))
            for url in URLS
        ]

    for filename in filenames:
        ydl_info = ydl_info.extract_info(url, download=False)
        track_id: str = ydl_info.get("id", None)
        os.makedirs(f"audio/temporal/{track_id}", exist_ok=True)

        thumbnail: str = ydl_info.get("thumbnail", None)
        response = requests.get(thumbnail)
        if response.status_code == 200:
            with open(f"audio/temporal/{track_id}/thumbnail.jpg", "wb") as f:
                f.write(response.content)

        subprocess.run(
            [
                "ffmpeg",  # command
                "-i",  # input
                filename,
                "-codec",  # codec to use
                "copy",
                "-start_number",  # start number of the output file
                "0",
                "-hls_time",  # time of each segment
                "20",
                "-hls_list_size",  # number of segments
                "0",
                "-f",  # format
                "hls",
                f"audio/temporal/{track_id}/index.m3u8",
            ]
        )

        os.remove(filename)
