FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY templates ./templates

EXPOSE 8080

ENV APP_VERSION=v1
ENV APP_NAME=SkyFly

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
