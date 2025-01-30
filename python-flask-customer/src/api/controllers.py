import logging
from const import FORMATTER

from flask import Blueprint, jsonify, request

api = Blueprint("api", __name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
console_handler.setFormatter(FORMATTER)
logger.addHandler(console_handler)


@api.route("/showing/program/<id>", methods=["GET"])
def get_all_showings_for_movie_program(id):
    from main import db_service

    logger.info(f"Id of program: {id}.")
    showings = db_service.get_showings_of_movie(id)
    logger.info(f"Fetched movie showings of program id: {id}.")

    showing_data = []
    for show in showings:
        show_dict = {
            "ShowID": show[0],
            "Date": show[1],
            "Price": show[2],
            "Form": show[3],
            "RoomID": show[4],
            "ProgramID": show[5],
        }
        showing_data.append(show_dict)

    return showing_data


@api.route("/available_seats/<id>", methods=["GET"])
def get_available_seats_of_show(id):
    from main import db_service

    seats = db_service.get_available_seats_of_show(id)
    logger.info(f"Fetched available seats of show id: {id}.")

    seat_data = []
    for seat in seats:
        seat_dict = {
            "ID": seat[0],
            "available": seat[1],
            "seatSeatID": seat[2],
            "ShowingID": seat[3],
        }
        seat_data.append(seat_dict)

    return seat_data


@api.route("/reservation/<client>", methods=["GET"])
def get_all_reservations(client):
    from main import db_service

    # TODO:Verify JWT token
    reservations = db_service.get_all_reservations(client)
    logger.info("Fetched all reservations.")

    return reservations


@api.route("/payment_services", methods=["GET"])
def get_payment_services():
    from main import db_service

    payments = db_service.get_payment_servicse()
    payment_data = []
    for payment in payments:
        payment_dict = {
            "ID": payment[0],
            "name": payment[1],
        }
        payment_data.append(payment_dict)

    return payment_data


@api.route("/buy_ticket/<id>", methods=["POST"])
def buy_ticket(id):
    from main import db_service

    data = request.get_json()
    if not data:
        logger.info("Could not read json data. Invalid JSON format")
        return jsonify({"error": "Invalid JSON format"}), 400
    logger.info(f"Recieved buying order of show id: {id} and data: {data}.")
    reservation_id = db_service.save_bought_ticket(data)
    return (
        jsonify({"message": "Saved successful", "reservationID": reservation_id}),
        200,
    )
