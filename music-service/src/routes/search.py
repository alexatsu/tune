from fastapi import APIRouter

from models.audio import ListenTemporal, SaveAndStore, ListenStream
from controllers.search import (
    search_songs,
    listen_temporal as listen_temp,
    save_and_store,
    streamTemporal
)

router = APIRouter()


@router.get("/search")
async def search(query: str = ""):
    return search_songs(query)

# @router.post("/listen-temporal")
# async def listen_temporal(payload: ListenTemporal):
#     return listen_temp(payload)


# @router.post("/save-and-store")
# async def save_song_and_store(payload: SaveAndStore):
#     return save_and_store(payload)

@router.get("/stream")
async def listenStream(url=""):
    return streamTemporal(url)