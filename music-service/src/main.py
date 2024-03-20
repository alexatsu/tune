import uvicorn
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import search

app = FastAPI()

load_dotenv()
ms_origin = os.getenv("MS_ORIGIN", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ms_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.mount("/audio", StaticFiles(directory="audio"), name="audio")
app.include_router(search.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
