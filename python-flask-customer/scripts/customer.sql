create table if not exists "Form" (
    "ID" serial not null,
    "movieFormName" varchar(255) not null unique,
    primary key ("ID")
);

create table if not exists "Showing" (
    "ID" serial not null,
    "Date" timestamp not null,
    "Price" int4 not null,
    "FormID" int4 not null,
    "ProgramID" int4 not null,
    "RoomID" int4 not null,
    primary key ("ID")
);

create table if not exists "AvailableSeats" (
    "ID" serial not null,
    "Available" char(1) default 'F' not null,
    "SeatseatID" int4 not null,
    "ShowingID" int4 not null,
    "ReservationID" int4,
    primary key ("ID")
);

create table if not exists "Reservation" (
    "ID" serial not null,
    "code" varchar(255) not null,
    "date" date not null,
    "ClientID" int4 not null,
    primary key ("ID")
);

create table if not exists "Ticket" (
    "ID" serial not null,
    "ReservationID" int4 not null,
    "PaymentID" int4 not null,
    "date" int4 not null,
    "TypeID" int4 not null,
    "to_be_paid" float4 not null,
    "verified" char(1) not null,
    "PaymentStatusID" int4 not null,
    primary key ("ID")
);

create table if not exists "CanceledTicket" (
    "ID" serial not null,
    "bank_account" varchar(255) not null,
    "date" date not null,
    "TicketReservationID" int4 not null,
    primary key ("ID")
);

create table if not exists "Client" (
    "ID" serial not null,
    "first_name" varchar(255) not null,
    "last_name" varchar(255) not null,
    "email" varchar(255) not null,
    "userID" int4,
    "telephone_number" varchar(255),
    primary key ("ID")
);

create table if not exists "Subscription" (
    "ID" serial not null,
    "name" varchar(255) not null,
    "userID" int4 not null,
    primary key ("ID")
);

create table if not exists "Payment" (
    "ID" serial not null,
    "name" varchar(255) not null unique,
    primary key ("ID")
);

create table if not exists "Type" (
    "ID" serial not null,
    "name" varchar(255) not null unique,
    primary key ("ID")
);

create table if not exists "PaymentStatus" (
    "ID" serial not null,
    "name" varchar(255) not null unique,
    primary key ("ID")
);

alter table if exists "AvailableSeats" add constraint "FKAvailableS211883" foreign key ("ShowingID") references "Showing" ("ID");
alter table if exists "AvailableSeats" add constraint "FKAvailableS723491" foreign key ("ReservationID") references "Reservation" ("ID");

alter table if exists "Ticket" add constraint "FKTicket622880" foreign key ("ReservationID") references "Reservation" ("ID");

alter table if exists "Reservation" add constraint "FKReservatio4788" foreign key ("ClientID") references "Client" ("ID");

alter table if exists "CanceledTicket" add constraint "FKCanceledTi156985" foreign key ("TicketReservationID") references "Ticket" ("ID");

alter table if exists "Ticket" add constraint "FKTicket330331" foreign key ("PaymentID") references "Payment" ("ID");
alter table if exists "Ticket" add constraint "FKTicket562546" foreign key ("TypeID") references "Type" ("ID");
alter table if exists "Ticket" add constraint "FKTicket915989" foreign key ("PaymentStatusID") references "PaymentStatus" ("ID");
