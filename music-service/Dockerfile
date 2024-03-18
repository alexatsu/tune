FROM python:3.12.2-slim
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install pipenv

COPY ./music-service/Pipfile .
COPY ./music-service/Pipfile.lock .

RUN pipenv install

WORKDIR /app/src

CMD ["pipenv", "run", "server"]