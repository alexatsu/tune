import subprocess
import os

import yt_dlp

URLS = ["https://www.youtube.com/watch?v=apKtYC1Vu6s"]

ydl_opts = {
    "format": "m4a/bestaudio/best",
    "covers": True,
    "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "aac",
        }
    ],
    "outtmpl": "audio/saved/%(title)s.m4a",
}


with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    error_code = ydl.download(URLS)
    filenames = [
        ydl.prepare_filename(ydl.extract_info(url, download=False)) for url in URLS
    ]

for filename in filenames:
    file_no_extension = os.path.splitext(filename)[0]

    create_folder = os.makedirs(f"{file_no_extension}", exist_ok=True)

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
            f"{file_no_extension}/index.m3u8",
        ]
    )

    os.remove(filename)
