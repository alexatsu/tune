from fastapi import APIRouter

from models.audio import ListenTemporal, AddMusic
from controllers.search import search_songs, listen_temporal as listen_temp, add_song

router = APIRouter()


@router.get("/search")
def search(query: str = ""):
    return search_songs(query)


@router.post("/listen-temporal")
async def listen_temporal(payload: ListenTemporal):
    return listen_temp(payload)


@router.post("/add-to-my-music")
async def add_to_my_music(payload: AddMusic):
    return add_song(payload)
