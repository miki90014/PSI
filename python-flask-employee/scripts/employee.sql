CREATE TABLE IF NOT EXISTS "Cinema" (
    "ID" serial not null,
    "name" varchar(100) NOT NULL UNIQUE,
    "address" varchar(500) NOT NULL,
    primary key ("ID")
);

CREATE TABLE IF NOT EXISTS "Offer" (
    "ID" serial not null,
    "start_date" date,
    "end_date" date,
    "CinemaID" int4 NOT NULL,
    primary key ("ID")
);

CREATE TABLE IF NOT EXISTS "Room" (
    "ID" serial not null,
    "name" varchar(255),
    "number" int4 NOT NULL,
    "CinemaID" int4 NOT NULL,
    primary key ("ID")
);

CREATE TABLE IF NOT EXISTS "Seat" (
    "ID" serial not null,
    "number" int4 NOT NULL,
    "row" varchar(10) NOT NULL,
    "RoomID" int4 NOT NULL,
    primary key ("ID")
);

CREATE TABLE IF NOT EXISTS "Genre" (
    "ID" serial not null,
    "genreName" varchar(255) NOT NULL UNIQUE,
    primary key ("ID")
);

CREATE TABLE IF NOT EXISTS "Movie" (
    "ID" serial not null,
    "title" varchar(255) NOT NULL,
    "duration" int4 NOT NULL,
    "description" varchar(1000) NOT NULL,
    "imageURL" varchar(255),
    "release_date" date NOT NULL,
    "cast" varchar(500),
    "director" varchar(255),
    "OfferID" int4 NOT NULL,
    "GenreID" int4,
    primary key ("ID")
);

CREATE TABLE IF NOT EXISTS "Program" (
    "ID" serial not null,
    "start_date" date,
    "end_date" date,
    "CinemaID" int4 NOT NULL,
    primary key ("ID")
);


alter table "Offer" add constraint "FKOffer240504" foreign key ("CinemaID") references "Cinema" ("ID");

alter table "Room" add constraint "FKRoom695405" foreign key ("CinemaID") references "Cinema" ("ID");

alter table "Movie" add constraint "FKMovie475464" foreign key ("OfferID") references "Offer" ("ID");
alter table "Movie" add constraint "FKMovie105996" foreign key ("GenreID") references "Genre" ("ID");

alter table "Seat" add constraint "FKSeat325787" foreign key ("RoomID") references "Room" ("ID");

alter table "Program" add constraint "FKProgram409311" foreign key ("CinemaID") references "Cinema" ("ID");
