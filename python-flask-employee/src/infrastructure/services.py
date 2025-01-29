from datetime import date

today = date.today()


class DatabaseService:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def get_movies_list(self):
        query = """
        SELECT "ID", title, "imageURL" FROM "Movie"
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def get_movie(self, id):
        query = f"""
        SELECT "Movie"."ID", "title", "duration", "description", "imageURL", "release_date", "cast", "director", "genreName", "OfferID" 
        FROM "Movie" JOIN "Genre" ON "Movie"."GenreID" = "Genre"."ID"
        WHERE "Movie"."ID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def get_cinemas_and_thier_active_programs(self, id):
        query = f"""
        SELECT "Cinema"."ID", "name", "address", "Program"."ID"
        FROM "Cinema" JOIN "Program" ON "Cinema"."ID" = "Program"."CinemaID"
        JOIN "Offer" ON "Cinema"."ID" = "Offer"."CinemaID"
        WHERE '{today}' BETWEEN "Program"."start_date" AND "Program"."end_date" AND "Offer"."ID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def get_room_name(self, id):
        query = f"""
        SELECT "name", "number"
        FROM "Room"
        WHERE "Room"."ID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def get_seats_of_room(self, id):
        query = f"""
        SELECT *
        FROM "Seat"
        WHERE "Seat"."RoomID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)
