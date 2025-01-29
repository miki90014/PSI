import logging
from const import FORMATTER

from flask import Blueprint

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
