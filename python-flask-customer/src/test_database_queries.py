import unittest
from unittest.mock import MagicMock
from datetime import datetime
import uuid
from infrastructure.services import (
    DatabaseService,
)  # Zmiana na odpowiednią lokalizację klasy DatabaseService


class TestDatabaseService(unittest.TestCase):

    def setUp(self):
        # Tworzymy mocka dla db_handler
        self.mock_db_handler = MagicMock()
        # Tworzymy instancję klasy DatabaseService, przekazując mocka
        self.db_service = DatabaseService(self.mock_db_handler)

    def test_get_showings_of_movie(self):
        # Ustawiamy mocka, aby zwrócił dane
        movie_id = 1
        mock_showings = [
            (1, "2025-01-01 12:00:00", 20.0, "2D", 1, 1),
            (2, "2025-01-01 14:00:00", 25.0, "3D", 1, 1),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_showings

        # Wywołanie testowanej metody
        result = self.db_service.get_showings_of_movie(movie_id)

        # Sprawdzamy, czy wynik jest poprawny
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0][0], 1)
        self.assertEqual(result[1][2], 25.0)

    def test_get_available_seats_of_show(self):
        show_id = 1
        mock_seats = [
            (1, "T", 1, 1),
            (2, "F", 2, 1),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_seats

        result = self.db_service.get_available_seats_of_show(show_id)

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0][1], "T")
        self.assertEqual(result[1][0], 2)

    def test_get_all_reservations(self):
        client_id = 1
        mock_reservations = [
            (1, 1, "2025-01-01 10:00:00", "sample_code", 1, 1, 20.0),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = (
            mock_reservations
        )

        result = self.db_service.get_all_reservations(client_id)

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0][3], "sample_code")
        self.assertEqual(result[0][6], 20.0)

    def test_get_payment_services(self):
        mock_payments = [
            (1, "Credit Card"),
            (2, "PayPal"),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_payments

        result = self.db_service.get_payment_servicse()

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0][1], "Credit Card")

    def test_save_bought_ticket(self):
        data = {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "phone": "123456789",
            "selectedSeats": [1, 2],
            "price": 30.0,
        }

        reservation_id = 123
        self.mock_db_handler.execute_and_return_id.return_value = reservation_id
        self.mock_db_handler.execute_query.return_value = None

        result = self.db_service.save_bought_ticket(data)

        self.assertEqual(result, reservation_id)

        self.mock_db_handler.execute_and_return_id.assert_called_once()
        self.mock_db_handler.execute_query.assert_called()

    def test_get_code(self):
        reservation_id = 1
        mock_code = [("sample_code",)]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_code

        result = self.db_service.get_code(reservation_id)

        self.assertEqual(result[0][0], "sample_code")


if __name__ == "__main__":
    unittest.main()
