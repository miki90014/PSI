INSERT INTO "Cinema" ("name", "address") VALUES
('Cinema City', '123 Main St'),
('IMAX', '456 Broadway');

INSERT INTO "Offer" ("start_date", "end_date", "CinemaID") VALUES
('2024-01-01', '2024-12-31', 1),
('2024-02-01', '2024-11-30', 2);

INSERT INTO "Room" ("name", "number", "CinemaID") VALUES
('Room A', 1, 1),
('Room B', 2, 1),
('Room C', 3, 2);

INSERT INTO "Seat" ("number", "row", "RoomID") VALUES
(1, 'A', 1),
(2, 'A', 1),
(1, 'B', 2),
(2, 'B', 2);

INSERT INTO "Genre" ("genreName") VALUES
('Action'),
('Comedy'),
('Drama');

INSERT INTO "Movie" ("title", "duration", "description", "imageURL", "release_date", "cast", "director", "OfferID", "GenreID") VALUES
('Inception', 148, 'A mind-bending thriller', 'inception.jpg', '2010-07-16', 'Leonardo DiCaprio', 'Christopher Nolan', 1, 1),
('The Hangover', 100, 'A comedy about a wild bachelor party', 'hangover.jpg', '2009-06-05', 'Bradley Cooper', 'Todd Phillips', 2, 2);

INSERT INTO "Program" ("start_date", "end_date", "CinemaID") VALUES
('2025-01-01', '2025-06-30', 1),
('2025-01-01', '2025-07-31', 2);
