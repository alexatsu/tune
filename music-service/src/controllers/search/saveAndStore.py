import os
import shutil

from utils.functions import download_song
from models.audio import SaveAndStore


def retreive_metadata(id: str):
    with open(f"audio/saved/{id}/metadata.json") as f:
        metadata = f.read()

    return metadata


def save_and_store(payload: SaveAndStore):
    conditions = [
        os.path.exists(f"audio/temporal/{payload.id}"),
        os.path.exists(f"audio/saved/{payload.id}"),
    ]

    if conditions[1]:
        return {"message": "Song already exists in saved"}

    if conditions[0]:
        try:
            shutil.copytree(f"audio/temporal/{payload.id}", f"audio/saved/{payload.id}")
            return {
                "message": "Song copied from temporal to saved",
                "metadata": retreive_metadata(payload.id),
            }

        except (FileNotFoundError, PermissionError):
            return {"error": "Error moving song from temporal to saved"}

    try:
        download_song(payload.url, "saved")

        return {
            "message": "Song downloaded and added successfully",
            "metadata": retreive_metadata(payload.id),
        }

    except Exception:
        return {"error": "Error downloading and adding song"}
