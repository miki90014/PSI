INSERT INTO "Showing" ("Date", "Price", "FormID", "ProgramID", "RoomID") VALUES
('2025-02-10 14:00:00', 15, 1, 1, 1),
('2025-02-15 16:30:00', 20, 2, 2, 2);

INSERT INTO "AvailableSeats" ("Available", "SeatseatID", "ShowingID") VALUES
('T', 1, 1),
('T', 2, 1),
('T', 3, 1),
('T', 4, 1),
('T', 5, 1),
('T', 6, 1),
('T', 7, 1),
('T', 8, 1),
('T', 9, 1),
('T', 10, 1),
('F', 11, 1),
('F', 12, 1),
('F', 13, 2),
('F', 14, 2),
('F', 15, 2),
('F', 16, 2),
('F', 17, 2),
('F', 18, 2),
('F', 19, 2),
('F', 20, 2),
('F', 21, 2),
('F', 22, 2),
('T', 23, 2),
('T', 24, 2);

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

INSERT INTO "Form" ("movieFormName") VALUES
('3D'),
('2D Dubbing'),
('2D Subbtitles');