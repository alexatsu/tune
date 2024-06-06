from pydantic import BaseModel
class GenCharts(BaseModel):
    payload: list[dict[str, str]]
    chartType: str
