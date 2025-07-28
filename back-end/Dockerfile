FROM python:3.12-slim

# Instala netcat-openbsd, gcc y libpq-dev para conectar con PostgreSQL
RUN apt-get update && apt-get install -y netcat-openbsd gcc libpq-dev && apt-get clean


WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=Agrosis.settings

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
