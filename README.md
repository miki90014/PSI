# How to use base from docker?

There are two separetes db in our repo: customer and employee. Below is instruction for employee database, however instruction for customer DB is similar:

1. Run script `python-flask-employee\scripts\dev-local\local-db.sh`
```
./scripts/dev-local/ocal-db.sh
```

2. Export all envs:
```
export POSTGRES_USER="admin"
export POSTGRES_PASSWORD="admin"
export POSTGRES_DB="employee"
export DATABASE_URL="postgresql://admin:admin@localhost:5400/${POSTGRES_DB}" #port 5432 for Customer DB
export PORT=5000
export SQL_PATH=../scripts/employee.sql #../scripts/customer.sql for Customer DB
export SQL_DATA_PATH=../scripts/data.sql
```

3. Go into `python-flask-employee\src` and run application:
```
python main.py
```