FROM python:3.12-alpine

WORKDIR /app
RUN mkdir -p /app/temp

COPY . .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python3", "main.py"]