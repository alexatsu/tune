import subprocess
import os
import yt_dlp
import requests

from .formatDuration import format_duration


def download_song(url: str, path: str):
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
        "ignoreerrors": True,
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
        file_path = f"audio/{path}/{track_id}"
        os.makedirs(file_path, exist_ok=True)

        # save thumbnail
        thumbnail: str = ydl_info.get("thumbnail", None)
        response = requests.get(thumbnail)
        if response.status_code == 200:
            with open(f"{file_path}/thumbnail.jpg", "wb") as f:
                f.write(response.content)

        # save metadata into json
        metadata = {
            "id": ydl_info["id"],
            "title": ydl_info["title"],
            "url": ydl_info["original_url"],
            "duration": format_duration(ydl_info.get("duration", None)),
        }

        with open(f"{file_path}/metadata.json", "w") as f:
            f.write(str(metadata))

        # convert song to hls and save it
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
                f"{file_path}/index.m3u8",
            ]
        )

        os.remove(filename)
        return metadata
