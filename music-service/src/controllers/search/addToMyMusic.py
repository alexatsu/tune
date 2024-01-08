import os

from utils.functions import download_track
from models.audio import AddMusic


def add_song(payload: AddMusic):
    if not hasattr(payload, "id") or not hasattr(payload, "url"):
        return {"error": "Invalid payload. 'id' and 'url' attributes are required."}

    conditions = [
        os.path.exists(f"audio/temporal/{payload.id}"),
        os.path.exists(f"audio/saved/{payload.id}"),
    ]

    if conditions[1]:
        return {"message": "Song already exists in saved"}

    if conditions[0]:
        try:
            os.rename(f"audio/temporal/{payload.id}", f"audio/saved/{payload.id}")
            return {"message": "Song moved from temporal to saved"}

        except (FileNotFoundError, PermissionError):
            return {"error": "Error moving song from temporal to saved"}

    try:
        download_track(payload.url, "saved")
        return {"message": "Song downloaded and added successfully"}

    except Exception:
        return {"error": "Error downloading and adding song"}
