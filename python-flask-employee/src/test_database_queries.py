import unittest
from unittest.mock import MagicMock
from datetime import date
from infrastructure.services import (
    DatabaseService,
)


class TestDatabaseService(unittest.TestCase):

    def setUp(self):
        self.mock_db_handler = MagicMock()
        self.db_service = DatabaseService(self.mock_db_handler)

    def test_get_movies_list(self):
        mock_movies = [
            (1, "Movie 1", "image1.jpg"),
            (2, "Movie 2", "image2.jpg"),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_movies

        result = self.db_service.get_movies_list()

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0][1], "Movie 1")
        self.assertEqual(result[1][2], "image2.jpg")

    def test_get_movie(self):
        mock_movie = [
            (
                1,
                "Movie 1",
                120,
                "Description",
                "image1.jpg",
                date(2025, 1, 1),
                "Cast",
                "Director",
                "Genre",
                101,
            )
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_movie

        result = self.db_service.get_movie(1)

        self.assertEqual(result[0][1], "Movie 1")
        self.assertEqual(result[0][2], 120)
        self.assertEqual(result[0][8], "Genre")

    def test_get_cinemas_and_their_active_programs(self):
        mock_cinemas = [
            (1, "Cinema 1", "Address 1", 1),
            (2, "Cinema 2", "Address 2", 2),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_cinemas

        result = self.db_service.get_cinemas_and_thier_active_programs(1)

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0][1], "Cinema 1")
        self.assertEqual(result[1][0], 2)

    def test_get_room_name(self):
        mock_room = [("Room 1", 101)]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_room

        result = self.db_service.get_room_name(1)

        self.assertEqual(result[0][0], "Room 1")
        self.assertEqual(result[0][1], 101)

    def test_get_seats_of_room(self):
        mock_seats = [(1, 1, 1, "T"), (2, 1, 2, "T"), (3, 2, 1, "F")]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_seats

        result = self.db_service.get_seats_of_room(1)

        self.assertEqual(len(result), 3)
        self.assertEqual(result[0][0], 1)
        self.assertEqual(result[2][3], "F")


if __name__ == "__main__":
    unittest.main()
