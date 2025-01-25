#!/usr/bin/bash

export POSTGRES_USER="admin"
export POSTGRES_PASSWORD="admin"
export POSTGRES_DB="customer"
export DATABASE_URL="postgresql://admin:admin@localhost:5432/${POSTGRES_DB}"

docker run --name postgres_17.2 \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 5432:5432 \
  -d postgres:17.2