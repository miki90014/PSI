class DatabaseService:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def get_showings_of_movie(self, id):
        query = f"""
        SELECT "Showing"."ID", TO_CHAR("Date", 'YYYY-MM-DD HH24:MI:SS') AS "Date", "Price", "Form"."movieFormName", "RoomID", "ProgramID" FROM "Showing" JOIN "Form" ON "Showing"."FormID"="Form"."ID"
        WHERE "Showing"."ProgramID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def get_available_seats_of_show(self, id):
        query = f"""
        SELECT * FROM "AvailableSeats"
        WHERE "AvailableSeats"."ShowingID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)
