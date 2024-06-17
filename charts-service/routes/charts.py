from fastapi import APIRouter,BackgroundTasks
from controllers.charts import generate_charts

from models.charts import GenCharts

router = APIRouter()
 

@router.post("/charts/top")
async def generate_top_charts(payload: GenCharts, background_tasks: BackgroundTasks):
    background_tasks.add_task(generate_top_charts, payload)
    return {"message": "success"}



def generate_top_charts(payload: GenCharts):
    print("i'm called from charts/top")
    generate_charts(payload)