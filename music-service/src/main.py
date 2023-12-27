import asyncio
from datetime import datetime, timedelta

import shutil

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import uvicorn

from utils.functions import download_audio, search_songs

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/audio", StaticFiles(directory="audio"), name="audio")


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/search")
async def search(query: str = ""):
    return search_songs(query)


class ListenTemporal(BaseModel):
    url: str
    title: str
    duration: str


@app.post("/listen-temporal")
async def listen_temporal(payload: ListenTemporal) -> dict[str, str | float]:
    duration = datetime.strptime(payload.duration, "%H:%M:%S")

    total_duration = timedelta(
        hours=duration.hour, minutes=duration.minute, seconds=duration.second
    ).total_seconds()

    download_audio(payload.url, "temporal")

    folder_path = "audio/temporal"

    asyncio.create_task(
        delete_temp_audio_after_delay(
            f"{folder_path}/{payload.title}", total_duration + (10 * 60)
        )
    )

    return {"message": "Song downloaded successfully"}


async def delete_temp_audio_after_delay(folder_name: str, total_duration: int) -> None:
    await asyncio.sleep(total_duration)

    shutil.rmtree(folder_name)


# when i click listen on music
# send from client url+duration to backend
# download music and store it in temporal
# delete the music from temporal after duration + 10 minutes


# @app.get("/download")
# async def download(url: str, duration: int):
#     return {"message": "Song downloaded successfully"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
