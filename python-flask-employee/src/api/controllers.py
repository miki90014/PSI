import logging
from const import FORMATTER

from flask import Blueprint, send_from_directory, jsonify, request

api = Blueprint("api", __name__, url_prefix="/employee")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
console_handler.setFormatter(FORMATTER)
logger.addHandler(console_handler)


@api.route("/movies", methods=["GET"])
def list_movies():
    from main import db_service

    movies = db_service.get_movies_list()
    logger.info(f"Fetched movies from database.")
    movies_data = []
    for movie in movies:
        movie_dict = {"ID": movie[0], "title": movie[1], "imageURL": movie[2]}
        movies_data.append(movie_dict)
    return movies_data


@api.route("/movie/<id>", methods=["GET"])
def list_movie(id):
    from main import db_service

    movie = db_service.get_movie(id)[0]
    logger.info(f"Fetched movie from database.")
    print(len(movie))
    print(type(movie))
    print(movie)
    return {
        "ID": movie[0],
        "title": movie[1],
        "duration": movie[2],
        "description": movie[3],
        "imageURL": movie[4],
        "release_date": movie[5],
        "cast": movie[6],
        "director": movie[7],
        "Genre": movie[8],
        "OfferID": movie[9],
    }


@api.route("/image/<image>", methods=["GET"])
def host_image(image):
    return send_from_directory("static/images", image)


@api.route("/cinema/offers/<id>/programs", methods=["GET"])
def get_cinemas_programs(id):
    from main import db_service

    cinemas = db_service.get_cinemas_and_thier_active_programs(id)
    logger.info(f"Fetched cinemas programs of offer id: {id}.")
    cinema_data = []
    for cinema in cinemas:
        cinema_dict = {
            "CinemaID": cinema[0],
            "name": cinema[1],
            "address": cinema[2],
            "ProgramID": cinema[3],
        }
        cinema_data.append(cinema_dict)
    return cinema_data


@api.route("/room/<id>", methods=["GET"])
def get_room_name(id):
    from main import db_service

    room = db_service.get_room_name(id)[0]
    logger.info(f"Fetched room of id: {id}.")

    return {"name": room[0], "number": room[1]}


@api.route("/seats/<id>", methods=["GET"])
def get_seats_of_room(id):
    from main import db_service

    seats = db_service.get_seats_of_room(id)
    logger.info(f"Fetched seats of room id: {id}.")

    seat_data = []
    for seat in seats:
        seat_dict = {"ID": seat[0], "number": seat[1], "row": seat[2]}
        seat_data.append(seat_dict)

    return seat_data


@api.route("/seat/<id>", methods=["GET"])
def get_seat_by_id(id):
    from main import db_service

    seat = db_service.get_seat_by_id(id)[0]
    logger.info(f"Fetched seat of id: {id}.")

    return {"ID": seat[0], "number": seat[1], "row": seat[2]}


@api.route("/test_performance", methods=["GET"])
def test_performance():
    return ""


@api.route("/cinemas", methods=["GET"])
def list_cinemas():
    from main import db_service

    cinemas = db_service.get_cinemas_list()
    logger.info(f"Fetched cienams from database.")
    cinema_data = []
    for cinema in cinemas:
        cinema_dict = {"ID": cinema[0], "name": cinema[1], "address": cinema[2]}
        cinema_data.append(cinema_dict)
    return cinema_data


@api.route("/cinema/<id>", methods=["GET"])
def get_cinema_by_id(id):
    from main import db_service

    cinema = db_service.get_cinema_by_id(id)[0]
    logger.info(f"Fetched cinema of id: {id}.")

    return {"ID": cinema[0], "name": cinema[1], "address": cinema[2]}


@api.route("/cinema/<id>/rooms", methods=["GET"])
def get_rooms_by_cinema(id):
    from main import db_service

    rooms = db_service.get_rooms_from_cinemas(id)
    logger.info(f"Fetched rooms of id: {id}.")
    rooms_data = []

    for room in rooms:
        room_dict = {"ID": room[0],"name": room[1], "number": room[2], "total_seats": room[3]}
        rooms_data.append(room_dict)
    return rooms_data

@api.route("/cinema/room/<id>", methods=["GET"])
def get_room_with_total_seats(id):
    from main import db_service

    room = db_service.get_room_with_total_seats(id)[0]
    logger.info(f"Fetched room of id: {id}.")

    return {"ID": room[0],"name": room[1], "number": room[2], "total_seats": room[3]}

@api.route("/cinema/room/<id>", methods=["PUT"])
def update_room(id):
    from main import db_service

    data = request.get_json()
    name = data.get('name')
    number = data.get('number')
    if not data:
        logger.info("Could not read json data. Invalid JSON format")
        return jsonify({"error": "Invalid JSON format"}), 400
    logger.info(f"Update room of id: {id} and data: {data}.")
    room_id = db_service.update_room(name, number, id)
    return (
        jsonify({"message": "Saved successful", "roomID": room_id}),
        200,
    )

@api.route("/cinema/<id>/room", methods=["POST"])
def save_room(id):
    from main import db_service

    data = request.get_json()
    name = data.get('name')
    number = data.get('number')
    total_seats = int(data.get('total_seats'))
    if not data:
        logger.info("Could not read json data. Invalid JSON format")
        return jsonify({"error": "Invalid JSON format"}), 400
    logger.info(f"Save room of id: {id} and data: {data}.")
    room_id_value = db_service.save_room(name, number, id)
    room_id = room_id_value[0][0] 
    logger.info(f"Saved room, id: {room_id}")

    rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    seat_number = 1 
    row_index = 0
    
    while seat_number <= total_seats:
        row_letter = rows[row_index]
        for seat_in_row in range(1, 7): 
            if seat_number > total_seats:
                break

            db_service.save_seat(seat_in_row, row_letter, room_id)
        
            seat_number += 1
        row_index += 1

    return (
        jsonify({"message": "Saved successful", "roomD": room_id}),
        200,
    )

@api.route("/cinema/<id>/programs", methods=["GET"])
def get_programs_by_cinema(id):
    from main import db_service

    programs = db_service.get_program_by_cinema(id)
    logger.info(f"Fetched programs of id: {id}.")
    programs_data = []

    for program in programs:
        program_dict = {"ID": program[0],"start_date": program[1], "end_date": program[2], "CinemaID": program[3]}
        programs_data.append(program_dict)
    return programs_data
