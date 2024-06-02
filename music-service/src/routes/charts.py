import json
from fastapi import APIRouter
from controllers.charts import create_top_chart
from models.audio import GenCharts

router = APIRouter()


@router.get("/charts/all")
async def get_all_charts():

    with open("charts.json", "r") as f:
        charts = json.load(f)

    return {"message": "success", "charts": charts}


@router.post("/charts/top")
async def generate_top_charts(payload: GenCharts):
    return create_top_chart(payload)
