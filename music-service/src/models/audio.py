from pydantic import BaseModel


class Search(BaseModel):
    name: str


class ListenTemporal(BaseModel):
    url: str
    id: str
    duration: str


class SaveAndStore(BaseModel):
    url: str
    id: str


class ListenStream(BaseModel):
    url: str


class GenCharts(BaseModel):
    payload: list[dict[str, str]]