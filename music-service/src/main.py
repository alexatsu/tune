# import os
# import shutil
# import asyncio
# from datetime import datetime, timedelta
# from pydantic import BaseModel

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# from utils.functions import download_audio
from routes import search


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
app.include_router(search.router)


# @app.get("/search")
# async def search(query: str = ""):
#     return search_songs(query)


# class ListenTemporal(BaseModel):
#     url: str
#     title: str
#     duration: str


# def audio_exists(folder_name: str) -> bool:
#     return os.path.exists(folder_name)


# async def delete_temp_audio_after_delay(folder_name: str, total_duration: int) -> None:
#     await asyncio.sleep(total_duration)

#     shutil.rmtree(folder_name)


# @app.post("/listen-temporal")
# async def listen_temporal(payload: ListenTemporal) -> dict[str, str | float]:
#     duration = datetime.strptime(payload.duration, "%H:%M:%S")

#     total_duration = timedelta(
#         hours=duration.hour, minutes=duration.minute, seconds=duration.second
#     ).total_seconds()

#     if not audio_exists(f"audio/temporal/{payload.title}"):
#         download_audio(payload.url, "temporal")

#         folder_path = "audio/temporal"

#         asyncio.create_task(
#             delete_temp_audio_after_delay(
#                 f"{folder_path}/{payload.title}", total_duration + (10 * 60)
#             )
#         )

#         return {"message": "Song downloaded successfully"}

#     return {"message": "Song already exists"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
