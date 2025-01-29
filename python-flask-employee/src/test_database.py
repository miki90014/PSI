import unittest
from unittest.mock import patch, MagicMock
import os
from infrastructure.database import DatabaseHandler
from infrastructure.models import TABLE_NAMES

db_host_name = os.getenv("DATABASE_URL")
sql_script_tables_path = os.getenv("SQL_PATH")
sql_script_mocked_data_path = os.getenv("SQL_DATA_PATH")


class TestDatabaseHandler(unittest.TestCase):

    @patch("psycopg2.connect")
    def test_connect_successful(self, mock_connect):
        # Arrange
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection

        # Act
        db_handler = DatabaseHandler()

        # Assert
        mock_connect.assert_called_once_with(db_host_name)
        self.assertEqual(db_handler.connection, mock_connection)
        self.assertEqual(db_handler.cursor, mock_connection.cursor.return_value)
        db_handler.close()
        mock_connection.close.assert_called_once()

    @patch("psycopg2.connect")
    def test_connect_failure(self, mock_connect):
        # Arrange
        mock_connect.side_effect = Exception("Connection failed")

        # Act
        db_handler = DatabaseHandler()

        # Assert
        self.assertIsNone(db_handler.connection)
        self.assertIsNone(db_handler.cursor)

    @patch("psycopg2.connect")
    @patch(
        "builtins.open", new_callable=unittest.mock.mock_open, read_data="SQL script"
    )
    @patch.object(DatabaseHandler, "_DatabaseHandler__table_exists")
    def test_prepare_database_error_handling(
        self, mock_table_exists, mock_open, mock_connect
    ):
        # Arrange
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        db_handler = DatabaseHandler()
        mock_table_exists.side_effect = lambda table_name: table_name not in TABLE_NAMES
        db_handler.execute_query = MagicMock(
            side_effect=Exception("SQL execution error")
        )

        # Act
        db_handler.preare_database()

        # Assert
        self.assertEqual(db_handler.execute_query.call_count, 1)

        mock_connection.commit.assert_not_called()

        db_handler.close()
        mock_connection.close.assert_called_once()

    @patch("psycopg2.connect")
    def test_execute_query_successful(self, mock_connect):
        # Arrange
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        db_handler = DatabaseHandler()
        mock_cursor = mock_connection.cursor.return_value

        # Act
        db_handler.execute_query("SELECT * FROM my_table")

        # Assert
        mock_cursor.execute.assert_called_once_with("SELECT * FROM my_table")
        mock_connection.commit.assert_called_once()
        db_handler.close()
        mock_connection.close.assert_called_once()

    @patch("psycopg2.connect")
    def test_execute_query_failure(self, mock_connect):
        # Arrange
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        db_handler = DatabaseHandler()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.execute.side_effect = Exception("Query failed")

        # Act
        db_handler.execute_query("SELECT * FROM my_table")

        # Assert
        mock_cursor.execute.assert_called_once_with("SELECT * FROM my_table")
        mock_connection.rollback.assert_called_once()
        db_handler.close()
        mock_connection.close.assert_called_once()

    @patch("psycopg2.connect")
    def test_table_exists_true(self, mock_connect):
        # Arrange
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        db_handler = DatabaseHandler()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = [1]  # Simulate table exists

        # Act
        result = db_handler._DatabaseHandler__table_exists("my_table")

        # Assert
        self.assertTrue(result)

    @patch("psycopg2.connect")
    def test_table_exists_false(self, mock_connect):
        # Arrange
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        db_handler = DatabaseHandler()
        mock_cursor = mock_connection.cursor.return_value
        mock_cursor.fetchone.return_value = None  # Simulate table does not exist

        # Act
        result = db_handler._DatabaseHandler__table_exists("my_table")

        # Assert
        self.assertFalse(result)


if __name__ == "__main__":
    unittest.main()
