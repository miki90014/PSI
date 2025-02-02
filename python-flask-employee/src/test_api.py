import unittest
from unittest.mock import patch
from flask import Flask
from api.controllers import (
    api,
)  # assuming the Flask blueprint 'api' is imported from 'app'
import json


class APITestCase(unittest.TestCase):

    def setUp(self):
        # Create a Flask app and register the blueprint
        self.app = Flask(__name__)
        self.app.register_blueprint(api)  # Register the blueprint with the Flask app
        self.app.testing = True

        # Create a test client
        self.client = self.app.test_client()

    def tearDown(self):
        # Cleanup any resources after each test if necessary
        pass

    @patch("main.db_service.get_movies_list")
    def test_list_movies(self, mock_get_movies_list):
        # Mock data
        mock_movies = [
            (1, "Movie 1", "http://example.com/movie1.jpg"),
            (2, "Movie 2", "http://example.com/movie2.jpg"),
        ]
        mock_get_movies_list.return_value = mock_movies

        response = self.client.get("/employee/movies")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["title"], "Movie 1")
        self.assertEqual(response.json[0]["imageURL"], "http://example.com/movie1.jpg")

    @patch("main.db_service.get_movie")
    def test_list_movie(self, mock_get_movie):
        # Mock data for a specific movie
        mock_movie = (
            1,
            "Movie 1",
            120,
            "Description",
            "http://example.com/movie1.jpg",
            "2025-01-01",
            "Actor 1",
            "Director 1",
            "Genre 1",
            101,
        )
        mock_get_movie.return_value = [mock_movie]

        response = self.client.get("/employee/movie/1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["title"], "Movie 1")
        self.assertEqual(response.json["duration"], 120)
        self.assertEqual(response.json["description"], "Description")

    @patch("flask.send_from_directory")
    def test_host_image(self, mock_send_from_directory):
        # Test sending an image file
        response = self.client.get("/employee/image/inception.jpg")
        self.assertEqual(response.status_code, 200)

    @patch("main.db_service.get_cinemas_and_thier_active_programs")
    def test_get_cinemas_programs(self, mock_get_cinemas_and_thier_active_programs):
        # Mock data for cinemas and their programs
        mock_cinemas = [
            (1, "Cinema 1", "Address 1", 101),
            (2, "Cinema 2", "Address 2", 102),
        ]
        mock_get_cinemas_and_thier_active_programs.return_value = mock_cinemas

        response = self.client.get("/employee/cinema/offers/1/programs")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["name"], "Cinema 1")
        self.assertEqual(response.json[1]["address"], "Address 2")

    @patch("main.db_service.get_room_name")
    def test_get_room_name(self, mock_get_room_name):
        # Mock data for room
        mock_room = ("Room 1", 1)
        mock_get_room_name.return_value = [mock_room]

        response = self.client.get("/employee/room/1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["name"], "Room 1")
        self.assertEqual(response.json["number"], 1)

    @patch("main.db_service.get_seats_of_room")
    def test_get_seats_of_room(self, mock_get_seats_of_room):
        # Mock data for seats
        mock_seats = [(1, 1, "A"), (2, 2, "B")]
        mock_get_seats_of_room.return_value = mock_seats

        response = self.client.get("/employee/seats/1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["number"], 1)
        self.assertEqual(response.json[1]["row"], "B")

    @patch("main.db_service.get_cinemas_list")
    def test_list_cinemas(self, mock_get_cinemas_list):
        mock_cinemas = [
            (1, "Cinema One", "123 Street"),
            (2, "Cinema Two", "456 Avenue"),
        ]
        mock_get_cinemas_list.return_value = mock_cinemas

        response = self.client.get("/employee/cinemas")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["name"], "Cinema One")

    @patch("main.db_service.get_cinema_by_id")
    def test_get_cinema_by_id(self, mock_get_cinema_by_id):
        mock_get_cinema_by_id.return_value = [(1, "Cinema One", "123 Street")]

        response = self.client.get("/employee/cinema/1")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["name"], "Cinema One")

    @patch("main.db_service.get_rooms_from_cinemas")
    def test_get_rooms_by_cinema(self, mock_get_rooms_from_cinemas):
        mock_get_rooms_from_cinemas.return_value = [
            (1, "Room A", 1, 50),
            (2, "Room B", 2, 100),
        ]

        response = self.client.get("/employee/cinema/1/rooms")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["name"], "Room A")

    @patch("main.db_service.get_room_with_total_seats")
    def test_get_room_with_total_seats(self, mock_get_room_with_total_seats):
        mock_get_room_with_total_seats.return_value = [(1, "Room A", 1, 50)]

        response = self.client.get("/employee/cinema/room/1")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["total_seats"], 50)

    @patch("main.db_service.update_room")
    def test_update_room(self, mock_update_room):
        mock_update_room.return_value = 1
        payload = {"name": "Updated Room", "number": 10}

        response = self.client.put("/employee/cinema/room/1", json=payload)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["roomID"], 1)

    @patch("main.db_service.save_room")
    @patch("main.db_service.save_seat")
    def test_save_room(self, mock_save_seat, mock_save_room):
        mock_save_room.return_value = [(1,)]
        payload = {"name": "New Room", "number": 3, "total_seats": 10}

        response = self.client.post("/employee/cinema/1/room", json=payload)
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["roomD"], 1)
        mock_save_seat.assert_called()

    @patch("main.db_service.get_program_by_cinema")
    def test_get_programs_by_cinema(self, mock_get_program_by_cinema):
        mock_get_program_by_cinema.return_value = [
            (1, "2024-06-01", "2024-06-10", 1),
            (2, "2024-07-01", "2024-07-15", 1),
        ]

        response = self.client.get("/employee/cinema/1/programs")
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["start_date"], "2024-06-01")


if __name__ == "__main__":
    unittest.main()
