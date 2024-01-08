from pydantic import BaseModel


class Search(BaseModel):
    name: str


class ListenTemporal(BaseModel):
    url: str
    id: str
    duration: str

class AddMusic(BaseModel):
    url: str
    id: str