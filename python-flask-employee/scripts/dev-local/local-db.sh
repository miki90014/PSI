#!/usr/bin/bash

export POSTGRES_USER="admin"
export POSTGRES_PASSWORD="admin"
export POSTGRES_DB="employee"
export DATABASE_URL="postgresql://admin:admin@localhost:5400/${POSTGRES_DB}"

docker run --name postgres_17.2_employee \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 5400:5432 \
  -d postgres:17.2