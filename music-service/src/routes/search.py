from fastapi import APIRouter

from models.audio import ListenTemporal
from controllers.search import search_songs, listen_temporal as listen_temp

router = APIRouter()


@router.get("/search")
def search(query: str = ""):
    return search_songs(query)


@router.post("/listen-temporal")
async def listen_temporal(payload: ListenTemporal):
    return listen_temp(payload)
