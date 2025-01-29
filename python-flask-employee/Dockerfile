FROM python:3.10-slim
ENV BACKEND_PORT=5000
ENV DATABASE_URL=${DATABASE_URL}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV SQL_PATH=/usr/src/app/employee.sql
ENV SQL_DATA_PATH=/usr/src/app/data.sql
WORKDIR /usr/src/app
COPY ./requirements.txt ./
COPY scripts/employee.sql ./
COPY scripts/data.sql ./

# RUN mkdir -p /root/.aws
# COPY credentials /root/.aws/credentials

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc

RUN pip install -r requirements.txt
COPY src ./
EXPOSE ${BACKEND_PORT}
CMD ["python", "main.py"]