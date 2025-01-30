import logging
from const import FORMATTER

from flask import Blueprint, send_from_directory

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
