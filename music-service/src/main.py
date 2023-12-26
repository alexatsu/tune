from datetime import datetime, timedelta

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

import uvicorn

from searchResults import search_songs

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
    duration_str = payload.duration

    # Parse the duration string
    duration = datetime.strptime(duration_str, "%H:%M:%S")

    # Get the total duration in seconds
    total_duration = timedelta(
        hours=duration.hour, minutes=duration.minute, seconds=duration.second
    ).total_seconds()

    # download music and store it in temporal
    return {"url": payload.url, "title": payload.title, "duration": total_duration}


# when i click listen on music
# send from client url+duration to backend
# download music and store it in temporal
# delete the music from temporal after duration + 10 minutes


# @app.get("/download")
# async def download(url: str, duration: int):
#     return {"message": "Song downloaded successfully"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
