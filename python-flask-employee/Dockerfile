FROM python:3.10-slim

ENV SQL_PATH=/usr/src/app/employee.sql
ENV SQL_DATA_PATH=/usr/src/app/data.sql
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc
WORKDIR /usr/src/app
COPY ./requirements.txt ./
RUN pip install -r requirements.txt
COPY scripts/employee.sql ./
COPY scripts/data.sql ./

# RUN mkdir -p /root/.aws
# COPY credentials /root/.aws/credentials

COPY src ./
EXPOSE 5000
CMD ["python", "main.py"]