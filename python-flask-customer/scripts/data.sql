INSERT INTO "Showing" ("Date", "Price", "FormID", "ProgramID", "RoomID") VALUES
('2024-06-10', 15, 1, 1, 1),
('2024-06-15', 20, 2, 2, 2);

INSERT INTO "AvailableSeats" ("Available", "SeatseatID", "ShowingID") VALUES
('T', 1, 1),
('F', 2, 1);

INSERT INTO "Client" ("first_name", "last_name", "email", "telephone_number") VALUES
('John', 'Doe', 'john.doe@example.com', '123-456-7890'),
('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210');

INSERT INTO "Reservation" ("code", "date", "ClientID") VALUES
('ABC123', '2024-06-10', 1),
('XYZ789', '2024-06-15', 2),
('XYZ789', '2024-06-15', 2);

INSERT INTO "Payment" ("name") VALUES
('BLIK'),
('Card');

INSERT INTO "Type" ("name") VALUES
('Standard'),
('VIP');

INSERT INTO "PaymentStatus" ("name") VALUES
('Accepted'),
('Canceled');

INSERT INTO "Ticket" ("ReservationID", "PaymentID", "date", "TypeID", "to_be_paid", "verified", "PaymentStatusID") VALUES
(1, 1, 20240610, 1, 15.0, 'T', 1),
(2, 2, 20240615, 2, 20.0, 'F', 2),
(3, 2, 20240615, 2, 20.0, 'F', 2);

INSERT INTO "CanceledTicket" ("bank_account", "date", "TicketReservationID") VALUES
('123456789', '2024-06-20', 1);
