from pydantic import BaseModel


class Search(BaseModel):
    name: str


class ListenTemporal(BaseModel):
    url: str
    title: str
    duration: str