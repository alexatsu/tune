from pydantic import BaseModel


class Search(BaseModel):
    name: str