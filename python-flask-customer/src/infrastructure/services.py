import logging
from const import FORMATTER
from datetime import date, datetime
import uuid
from .bridge import get_movie_by_id, get_room_by_id, get_seat_by_id

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
console_handler.setFormatter(FORMATTER)
logger.addHandler(console_handler)


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

    def get_all_reservations(self, client):
        query = f"""
        SELECT "Reservation"."ID", MIN("Showing"."MovieID"),
        MIN("Showing"."Date"), MIN("Showing"."RoomID"),
        ARRAY_AGG("AvailableSeats"."SeatseatID"), MIN("Ticket"."to_be_paid"), MIN("CanceledTicket"."ID")
        FROM "Reservation" JOIN "AvailableSeats" ON "Reservation"."ID"="AvailableSeats"."ReservationID"
        JOIN "Showing" ON "AvailableSeats"."ShowingID"="Showing"."ID"
        LEFT JOIN "Ticket" ON "Reservation"."ID"="Ticket"."ReservationID" LEFT JOIN "CanceledTicket" ON "Ticket"."ID"="CanceledTicket"."TicketReservationID" WHERE "Reservation"."ClientID" = %s
        GROUP BY "Reservation"."ID";
        """
        temp =   self.db_handler.execute_query_and_fetch_result(query, (client,))
        result = []
        for i in temp:
            movie = get_movie_by_id(i[1])
            timeStamp = i[2]
            hallID = i[3]
            seats = []
            for j in i[4]:
                seat = get_seat_by_id(j)
                seats.append({"row": seat["row"], "seat": seat["number"]})
            result.append({
                "id": i[0],
                "movie":{ "imageURL":movie["imageURL"], "title": movie["title"]},
                "showingDetails": {"date": str(timeStamp.date()), "hour": str(timeStamp.time())[:-3]},
                "hall": get_room_by_id(hallID)["name"],
                "seats": seats,
                "price": i[5],
                "canceled": i[6] is not None
            })
        return result
  
    def post_confirm_reservation(self, reservationID):
        query="""INSERT INTO "Ticket" ("ReservationID", "PaymentID", "date", "TypeID", "to_be_paid", "verified", "PaymentStatusID") VALUES
        (%s, 1, %s, 1, 15.0, 'T', 1)"""
        self.db_handler.execute_query_and_fetch_result(query, (reservationID, datetime.now()))

    def post_cancel_reservation(self, reservationID):
        query="""SELECT "ID" FROM "Ticket" WHERE "ReservationID"=%s"""
        ticketID = self.db_handler.execute_query_and_fetch_result(query, (reservationID,))[0][0]
        query="""INSERT INTO "CanceledTicket" ("bank_account", "date","TicketReservationID") VALUES (%s, %s, %s)"""
        self.db_handler.execute_query_and_fetch_result(query, ("345905678945678956",datetime.now(),ticketID,))

    def get_client_by_email(self, email):
        query = f"""
        SELECT * FROM "Client"
        WHERE "Client"."email"= %s
        """
        return self.db_handler.execute_query_and_fetch_result(query, (email,))

    def get_payment_servicse(self):
        query = f"""
        SELECT * FROM "Payment"
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def save_bought_ticket(self, data):
        time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        selected_seats_tuple = tuple(data["selectedSeats"])
        query = f"""
            WITH new_user AS (
                INSERT INTO "Client" ("first_name", "last_name", "email", "telephone_number")
                VALUES ('{data["firstName"]}', '{data["lastName"]}', '{data["email"]}', '{data["phone"]}')
                ON CONFLICT (email) DO NOTHING
                RETURNING "ID"
            )
            INSERT INTO "Reservation" ("code", "date", "ClientID")
            VALUES (
                '{str(uuid.uuid4())}', 
                '{time_now}',
                COALESCE(
                    (SELECT "ID" FROM new_user),  
                    (SELECT "ID" FROM "Client" WHERE email = '{data["email"]}' LIMIT 1)  
                )
            )
            RETURNING "ID";
        """
        reservation_id = self.db_handler.execute_and_return_id(query)
        logger.info(
            f"Successfully registred payment and ticket. ReservationID: {reservation_id}. Updating available seats..."
        )

        update_query = f"""
            INSERT INTO "Ticket" ("ReservationID", "PaymentID", "date", "TypeID", "to_be_paid", "verified", "PaymentStatusID") 
            VALUES ({reservation_id}, 1, '{time_now}', 1, {data["price"]}, 'T', 1);
            UPDATE "AvailableSeats" SET "ReservationID"={reservation_id}, "Available" = 'F' 
            WHERE "AvailableSeats"."SeatseatID" IN {selected_seats_tuple};
        """

        self.db_handler.execute_query(update_query)
        return reservation_id

    def get_seats_of_reservation(self, id):
        query = f"""
            SELECT * FROM "AvailableSeats"
            WHERE "AvailableSeats"."ReservationID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)

    def get_code(self, id):
        query = f"""
        SELECT "code" FROM "Reservation"
        WHERE "Reservation"."ID"={id}
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_ticket(self, code):
        query = f"""
        SELECT 
            t."ID" AS ticket_id,
            t."verified" as verfified,
            s."Date" AS showing_date,
            s."RoomID" as room_id,
            s."MovieID" as movie_id
        FROM 
            "Ticket" t
        JOIN 
            "Reservation" r ON t."ReservationID" = r."ID"
        JOIN 
            "AvailableSeats" a ON r."ID" = a."ReservationID"
        JOIN 
            "Showing" s ON a."ShowingID" = s."ID"
        WHERE 
            r."code" = '{code}';
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def update_ticket(self, id):
        query = f"""
        UPDATE "Ticket"
        SET "verified" = 'T'
        WHERE "ID" = {id}
        """
        return self.db_handler.execute_query(query)
    
    def get_reservation_id_from_code(self, code):
        query = f"""
        SELECT "ID" FROM "Reservation"
        WHERE "Reservation"."code"='{code}'
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_showings(self):
        query = f"""
        SELECT "ID", "Date", "RoomID", "MovieID" FROM "Showing"
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_forms(self):
        query = f"""
        SELECT * FROM "Form"
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def add_showing(self, data):
        query = f"""
        INSERT INTO "Showing" ("Date", "Price", "FormID", "ProgramID", "RoomID", "MovieID") VALUES
            ('{data['date']}', {data['price']}, {data['formatId']}, {data['programId']}, {data['roomId']}, {data['movieId']})
        RETURNING "ID";
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def add_available_seats(self, seat_id, showingId):
        query = f"""
        INSERT INTO "AvailableSeats" ("Available", "SeatseatID", "ShowingID", "ReservationID") VALUES
        ('T', {seat_id}, {showingId}, NULL)
        RETURNING "ID";
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
    def get_showings_by_movie_with_attandance(self, movieID):
        query = f"""
        SELECT 
            s."ID", 
            s."Date", 
            s."RoomID", 
            COALESCE(
                ROUND(
                    (COUNT(CASE WHEN a."ReservationID" IS NOT NULL THEN 1 END) * 100.0) 
                    / NULLIF(COUNT(a."ID"), 0), 
                    2
                ), 
                0.0
            ) AS "Attendance"
        FROM "Showing" s
        LEFT JOIN "AvailableSeats" a ON s."ID" = a."ShowingID"
        WHERE s."MovieID" = {movieID}
        GROUP BY s."ID", s."Date", s."RoomID";
        """
        return self.db_handler.execute_query_and_fetch_result(query)
    
