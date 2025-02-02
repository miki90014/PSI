import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime
import uuid
from infrastructure.services import (
    DatabaseService,
)


class TestDatabaseService(unittest.TestCase):

    def setUp(self):
        self.mock_db_handler = MagicMock()
        self.db_service = DatabaseService(self.mock_db_handler)

    def test_get_showings_of_movie(self):
        # Mock data
        movie_id = 1
        mock_showings = [
            (1, "2025-01-01 12:00:00", 20.0, "2D", 1, 1),
            (2, "2025-01-01 14:00:00", 25.0, "3D", 1, 1),
        ]
        self.mock_db_handler.execute_query_and_fetch_result.return_value = mock_showings

        result = self.db_service.get_showings_of_movie(movie_id)

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

    @patch("infrastructure.services.datetime")
    def test_post_confirm_reservation(self, mock_datetime):
        mock_datetime.now.return_value = datetime(2024, 2, 1, 12, 0, 0)

        reservation_id = 123
        self.db_service.post_confirm_reservation(reservation_id)

        _, actual_params = (
            self.mock_db_handler.execute_query_and_fetch_result.call_args[0]
        )

        self.assertEqual(
            (reservation_id, mock_datetime.now.return_value), actual_params
        )

    @patch("infrastructure.services.datetime")
    def test_post_cancel_reservation(self, mock_datetime):
        # Mock data
        mock_datetime.now.return_value = datetime(2024, 2, 1, 12, 0, 0)

        reservation_id = 123
        mock_ticket_id = 456

        self.mock_db_handler.execute_query_and_fetch_result.side_effect = [
            [(mock_ticket_id,)],
            None,
        ]

        self.db_service.post_cancel_reservation(reservation_id)

        self.mock_db_handler.execute_query_and_fetch_result.assert_any_call(
            """SELECT "ID" FROM "Ticket" WHERE "ReservationID"=%s""", (reservation_id,)
        )

    def test_get_client_by_email(self):
        # Mock data
        client_email = "test@example.com"
        mock_client_data = [(1, "John", "Doe", client_email, 42, "123456789")]

        self.mock_db_handler.execute_query_and_fetch_result.return_value = (
            mock_client_data
        )

        result = self.db_service.get_client_by_email(client_email)

        _, actual_params = (
            self.mock_db_handler.execute_query_and_fetch_result.call_args[0]
        )

        self.assertEqual((client_email,), actual_params)
        self.assertEqual(result, mock_client_data)

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
