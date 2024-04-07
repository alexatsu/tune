from fastapi import APIRouter
from controllers.chill.extractChillStreams import extract_chill_streams as ext_chill

router = APIRouter()


@router.get("/chill/extract")
async def extract_chill_streams():
    return ext_chill()
