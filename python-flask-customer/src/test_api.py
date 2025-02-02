import unittest
from unittest.mock import patch
from flask import Flask
from api.controllers import (
    api,
)
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

    @patch("main.db_service.get_showings_of_movie")
    def test_get_all_showings_for_movie_program(self, mock_get_showings_of_movie):
        # Mock data
        mock_showings = [
            (1, "2025-01-30", 12.99, "2D", 1, 101),
            (2, "2025-01-31", 15.99, "3D", 2, 101),
        ]
        mock_get_showings_of_movie.return_value = mock_showings

        response = self.client.get("/customer/showing/program/101")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["ShowID"], 1)
        self.assertEqual(response.json[0]["Price"], 12.99)

    @patch("main.db_service.get_available_seats_of_show")
    def test_get_available_seats_of_show(self, mock_get_available_seats_of_show):
        # Mock data
        mock_seats = [
            (1, True, 1, 101),
            (2, False, 2, 101),
        ]
        mock_get_available_seats_of_show.return_value = mock_seats

        response = self.client.get("/customer/available_seats/101")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["available"], True)
        self.assertEqual(response.json[1]["available"], False)

    @patch("main.db_service.get_all_reservations")
    def test_get_all_reservations(self, mock_get_all_reservations):
        # Mock data
        mock_reservations = [
            {"reservation_id": 1, "client": "client1", "show_id": 101},
            {"reservation_id": 2, "client": "client1", "show_id": 102},
        ]
        mock_get_all_reservations.return_value = mock_reservations

        response = self.client.get("/customer/reservation/client1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["client"], "client1")

    @patch("main.db_service.get_client_by_email")
    def test_get_client_by_email(self, mock_get_client_by_email):
        # Mock data
        client_email = "test@example.com"
        mock_client_data = (1, "John", "Doe", client_email, 42, "123456789")
        mock_get_client_by_email.return_value = mock_client_data

        response = self.client.get(f"/customer/client/{client_email}")
        mock_get_client_by_email.assert_called_once_with(client_email)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json(),
            {
                "ID": 1,
                "first_name": "John",
                "last_name": "Doe",
                "email": client_email,
                "userID": 42,
                "telephone_number": "123456789",
            },
        )

    @patch("main.db_service.post_confirm_reservation")
    def test_post_confirm_reservation(self, mock_confirm_reservation):
        reservation_id = "123"
        response = self.client.post(f"/customer/confirm_reservation/{reservation_id}")

        mock_confirm_reservation.assert_called_once_with(reservation_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Reservation confirmed."})

    @patch("main.db_service.post_cancel_reservation")
    def test_post_cancel_reservation(self, mock_cancel_reservation):
        reservation_id = "123"
        response = self.client.post(f"/customer/cancel_reservation/{reservation_id}")

        mock_cancel_reservation.assert_called_once_with(reservation_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Reservation canceled."})

    @patch("main.db_service.get_payment_servicse")
    def test_get_payment_services(self, mock_get_payment_servicse):
        # Mock data
        mock_payments = [
            (1, "Credit Card"),
            (2, "PayPal"),
        ]
        mock_get_payment_servicse.return_value = mock_payments

        response = self.client.get("/customer/payment_services")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 2)
        self.assertEqual(response.json[0]["name"], "Credit Card")

    @patch("main.db_service.save_bought_ticket")
    def test_buy_ticket(self, mock_save_bought_ticket):
        mock_data = {"seat_id": 1, "client": "client1", "show_id": 101}
        mock_reservation_id = 12345
        mock_save_bought_ticket.return_value = mock_reservation_id

        response = self.client.post("/customer/buy_ticket/101", json=mock_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("reservationID", response.json)
        self.assertEqual(response.json["reservationID"], mock_reservation_id)

    def test_get_pdf(self):
        response = self.client.get("/customer/ticket_pdf/12345/movie_name")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "application/pdf")
        self.assertTrue(response.data.startswith(b"%PDF"))

    def test_get_code_qr(self):
        response = self.client.get("/customer/download_code/12345")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "image/png")
        self.assertTrue(response.data.startswith(b"\x89PNG"))

    @patch("main.db_service.get_code")
    def test_get_code(self, mock_get_code):
        # Mock data
        mock_code = ("ABCD1234",)
        mock_get_code.return_value = [mock_code]

        response = self.client.get("/customer/ticket_code/1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["code"], "ABCD1234")


if __name__ == "__main__":
    unittest.main()
