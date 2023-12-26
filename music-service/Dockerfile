FROM python:3.12.0-bullseye

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install pipenv

COPY Pipfile .
COPY Pipfile.lock .

RUN pipenv install

WORKDIR /app/src

CMD ["pipenv", "run", "server"]