import psycopg2
from psycopg2 import OperationalError
import threading
import os
import logging
from const import FORMATTER
from infrastructure.models import TABLE_NAMES
import sys

db_host_name = os.getenv("DATABASE_URL")
db_username = os.getenv("POSTGRES_USER")
db_password = os.getenv("POSTGRES_PASSWORD")
sql_script_tables_path = os.getenv("SQL_PATH")
sql_script_mocked_data_path = os.getenv("SQL_DATA_PATH")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
console_handler.setFormatter(FORMATTER)
logger.addHandler(console_handler)


class DatabaseHandler:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.db_url = db_host_name
        self.connection = None
        self.cursor = None
        self.connect()

    def connect(self):
        try:
            self.connection = psycopg2.connect(self.db_url)
            self.cursor = self.connection.cursor()
            self.connection.autocommit = True
            logger.info("The connection to the database has been established.")
        except OperationalError as e:
            logger.error(f"Error during connetion to the database: {e}")
        except Exception as e:
            logger.error(f"Unknown error: {e}")

    def __table_exists(self, table_name):
        query = """
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = %s;
        """
        self.cursor.execute(query, (table_name,))
        return bool(self.cursor.fetchone())

    def preare_database(self):
        missing_tables = [
            table for table in TABLE_NAMES if not self.__table_exists(table)
        ]
        if missing_tables:
            logger.info(f"Tables does not exist. Creating tables...")
            try:
                with open(sql_script_tables_path, "r") as file:
                    sql_script = file.read()
                self.connection.autocommit = False
                self.execute_query(sql_script)
                logger.info("The tables in database was created using a script.")
                with open(sql_script_mocked_data_path, "r") as file:
                    sql_script = file.read()
                self.execute_query(sql_script)
                self.connection.commit()
                logger.info("The tables in database was filled with data.")
            except Exception as e:
                logger.error(f"Error during database tables creation from script: {e}")

    def execute_query(self, query):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                self.connection.commit()
                logger.info("The query was completed successfully.")
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            self.connection.rollback()

    def execute_query_and_fetch_result(self, query):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                self.connection.commit()
                logger.info("The query was completed successfully.")
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            self.connection.rollback()
            return None

    def execute_and_return_id(self, query):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query)
                self.connection.commit()
                logger.info("The query was completed successfully.")
                return cursor.fetchone()[0]
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            self.connection.rollback()
            return None

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        logger.info("The connection to the database has been closed.")
