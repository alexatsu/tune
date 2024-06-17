from pydantic import BaseModel


class GenCharts(BaseModel):
    payload: dict[str, list[dict[str, str]]]
    
