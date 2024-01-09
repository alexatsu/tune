def format_duration(duration: float) -> str:
    hours = (duration / 60) / 60
    minutes = (duration / 60) % 60
    seconds = duration % 60
    return f"{int(hours)}:{int(minutes)}:{int(seconds)}"
