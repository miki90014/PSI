import logging
from const import FORMATTER
from datetime import date, datetime
import uuid

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
        SELECT * FROM "Reservation" JOIN "AvailableSeats" ON "Reservation"."ID"="AvailableSeats"."ReservationID"
        JOIN "Showing" ON "AvailableSeats"."ShowingID"="Showing"."ID"
        JOIN "Ticket" ON "Reservation"."ID"="Ticket"."ReservationID" WHERE "Reservation"."ClientID" = %s;
        """
        return self.db_handler.execute_query_and_fetch_result(query, (client,))

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
