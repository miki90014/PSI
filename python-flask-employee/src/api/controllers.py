import logging
from const import FORMATTER

from flask import Blueprint, send_from_directory

api = Blueprint("api", __name__)

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
    }


@api.route("/image/<image>", methods=["GET"])
def host_image(image):
    return send_from_directory("static/images", image)
