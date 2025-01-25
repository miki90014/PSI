FROM python:3.11-slim
ENV BACKEND_PORT=${BACKEND_PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV SQL_PATH=/usr/src/app/customer.sql
WORKDIR /usr/src/app
COPY ../requirements.txt ./
COPY ../customer.sql ./

# RUN mkdir -p /root/.aws
# COPY credentials /root/.aws/credentials

RUN pip install -r requirements.txt
COPY ../src ./
COPY ../main.py ./
EXPOSE ${BACKEND_PORT}
CMD ["python", "main.py"]