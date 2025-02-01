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
    
    def get_seat_by_id(self, id):
        query = """
        SELECT *
        FROM "Seat"
        WHERE "Seat"."ID"=%s
        """
        return self.db_handler.execute_query_and_fetch_result(query, (id,))
    
    def get_cinemas_list(self):
        query = """
        SELECT "ID", "name", "address" FROM "Cinema"
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_cinema_by_id(self, id):
        query = f"""
        SELECT "ID", "name", "address" 
        FROM "Cinema"
        WHERE "ID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_rooms_from_cinemas(self, id):
        query = f"""
        SELECT 
            r."ID", 
            r."name", 
            r."number", 
            COUNT(s."ID") AS "total_seats"
        FROM 
            "Room" r
        LEFT JOIN 
            "Seat" s ON s."RoomID" = r."ID"
        WHERE 
            r."CinemaID" = {id}
        GROUP BY 
            r."ID", r."name", r."number"
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_room_with_total_seats(self, id):
        query = f"""
        SELECT 
            r."ID", 
            r."name", 
            r."number", 
            COUNT(s."ID") AS "total_seats"
        FROM 
            "Room" r
        LEFT JOIN 
            "Seat" s ON s."RoomID" = r."ID"
        WHERE 
            r."ID" = {id}
        GROUP BY 
            r."ID", r."name", r."number"
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def save_room(self, name, number, cinemaID):
        query = f"""
        INSERT INTO "Room" ("name", "number", "CinemaID")
        VALUES ('{name}', {number}, {cinemaID})
        RETURNING "ID"
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def update_room(self, name, number, room_id):
        query = f"""
        UPDATE "Room"
        SET "name" = '{name}',
            "number" = {number}
        WHERE "ID" = {room_id};
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def save_seat(self, number, row, roomID):
        query = f"""
        INSERT INTO "Seat" ("number", "row", "RoomID")
        VALUES ({number}, '{row}', {roomID})
        """
        return self.db_handler.execute_query_and_fetch_result(query)
