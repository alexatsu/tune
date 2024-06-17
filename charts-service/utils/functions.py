def format_duration(duration: float) -> str:
    if duration is None:
        return "0:0:0"

    hours = (duration / 60) / 60
    minutes = (duration / 60) % 60
    seconds = duration % 60

    return f"{int(hours)}:{int(minutes)}:{int(seconds)}"
