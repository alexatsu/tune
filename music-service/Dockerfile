FROM python:3.12.0-bullseye

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install --user pipenv

COPY Pipfile .
COPY Pipfile.lock .

RUN pipenv install

COPY . .

CMD ["pipenv", "run", "server"]