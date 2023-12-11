from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
import json

from models.audio import Search
from searchResults import search_songs

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/audio", StaticFiles(directory="audio"), name="audio")


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.post("/search")
def search(name: Search):
    songs = search_songs(name)
    return Response(content=json.dumps(songs), media_type="application/json")

# @app.post("/download")
# def download(url: str):


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
