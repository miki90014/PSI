INSERT INTO "Showing" ("Date", "Price", "FormID", "ProgramID", "RoomID", "MovieID") VALUES
('2025-02-10 14:00:00', 15, 1, 1, 1, 1),
('2025-02-15 16:30:00', 20, 2, 2, 2, 2);

INSERT INTO "Client" ("first_name", "last_name", "email", "telephone_number") VALUES
('John', 'Doe', 'john.doe@example.com', '123-456-7890'),
('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210');

INSERT INTO "Reservation" ("code", "date", "ClientID") VALUES
('ABC123', '2025-01-10 14:00:00', 1),
('XYZ789', '2025-01-10 14:00:00', 2),
('XYZ789', '2025-01-10 14:00:00', 2);

INSERT INTO "AvailableSeats" ("Available", "SeatseatID", "ShowingID", "ReservationID") VALUES
('T', 1, 1, 1),
('T', 2, 1, 1),
('T', 3, 1, 1),
('T', 4, 1, 1),
('T', 5, 1, 1),
('T', 6, 1, 1),
('T', 7, 1, 1),
('T', 8, 1, 1),
('T', 9, 1, 1),
('T', 10, 1, 1),
('F', 11, 1, null),
('F', 12, 1, null),
('F', 13, 2, null),
('F', 14, 2, null),
('F', 15, 2, null),
('F', 16, 2, null),
('F', 17, 2, null),
('F', 18, 2, null),
('F', 19, 2, null),
('F', 20, 2, null),
('F', 21, 2, null),
('F', 22, 2, null),
('T', 23, 2, 2),
('T', 24, 2, 2);

INSERT INTO "Payment" ("name") VALUES
('BLIK'),
('Card');

INSERT INTO "Type" ("name") VALUES
('Ticket'),
('Reservation');

INSERT INTO "PaymentStatus" ("name") VALUES
('Accepted'),
('Canceled');

INSERT INTO "Ticket" ("ReservationID", "PaymentID", "date", "TypeID", "to_be_paid", "verified", "PaymentStatusID") VALUES
(1, 1, '2025-01-10 14:00:00', 1, 15.0, 'T', 1),
(2, 2, '2025-01-10 14:00:00', 2, 20.0, 'F', 2),
(3, 2, '2025-01-10 14:00:00', 2, 20.0, 'F', 2);

INSERT INTO "CanceledTicket" ("bank_account", "date", "TicketReservationID") VALUES
('123456789', '2024-06-20', 1);

INSERT INTO "Form" ("movieFormName") VALUES
('3D'),
('2D Dubbing'),
('2D Subbtitles');