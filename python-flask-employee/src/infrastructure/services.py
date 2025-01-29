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
        SELECT "Movie"."ID", "title", "duration", "description", "imageURL", "release_date", "cast", "director", "genreName" 
        FROM "Movie" JOIN "Genre" ON "Movie"."GenreID" = "Genre"."ID"
        WHERE "Movie"."ID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)
