import psycopg2
from psycopg2 import OperationalError
import threading
import os
import logging
from const import FORMATTER
from infrastructure.models import TABLE_NAMES

db_host_name = os.getenv("DATABASE_URL")
db_username = os.getenv("POSTGRES_USER")
db_password = os.getenv("POSTGRES_PASSWORD")
sql_script_path = os.getenv("SQL_PATH")


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
            self.connection.autocommit = True
            self.cursor = self.connection.cursor()
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
                with open(sql_script_path, "r") as file:
                    sql_script = file.read()
                self.connection.autocommit = False
                self.execute_query(sql_script)
                self.connection.commit()
                logger.info("The tables in database was created using a script.")
            except Exception as e:
                logger.error(f"Error during database tables creation from script: {e}")

    def execute_query(self, query):
        try:
            self.cursor.execute(query)
            self.connection.commit()
            logger.info("The query was completed successfully.")
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            self.connection.rollback()

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        logger.info("The connection to the database has been closed.")
