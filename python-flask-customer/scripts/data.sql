insert into "Showing" (
   "Date",
   "Price",
   "FormID",
   "ProgramID",
   "RoomID",
   "MovieID"
) values ( '2025-02-20 14:00:00',
           15,
           1,
           1,
           1,
           1 ),( '2025-02-25 16:30:00',
                 20,
                 2,
                 2,
                 2,
                 2 );

insert into "Client" (
   "first_name",
   "last_name",
   "email",
   "telephone_number"
) values ( 'John',
           'Doe',
           'john.doe@example.com',
           '123-456-7890' ),( 'Jane',
                              'Smith',
                              'jane.smith@example.com',
                              '987-654-3210' );

insert into "Reservation" (
   "code",
   "date",
   "ClientID"
) values ( 'ABC123',
           '2025-01-10 14:00:00',
           1 ),( 'XXX789',
                 '2025-01-10 14:00:00',
                 2 ),( 'YYY789',
                       '2025-01-10 14:00:00',
                       2 ),( 'ZZZ789',
                             '2025-01-10 14:00:00',
                             1 ),( 'AAA789',
                                   '2025-01-10 14:00:00',
                                   1 ),( 'BBB789',
                                         '2025-01-10 14:00:00',
                                         1 );


insert into "AvailableSeats" (
   "Available",
   "SeatseatID",
   "ShowingID",
   "ReservationID"
) values ( 'T',
           1,
           1,
           null ),( 'T',
                    2,
                    1,
                    null ),( 'T',
                             3,
                             1,
                             null ),( 'T',
                                      4,
                                      1,
                                      null ),( 'T',
                                               5,
                                               1,
                                               null ),( 'T',
                                                        6,
                                                        1,
                                                        null ),( 'T',
                                                                 7,
                                                                 1,
                                                                 null ),( 'T',
                                                                          8,
                                                                          1,
                                                                          null ),( 'T',
                                                                                   9,
                                                                                   1,
                                                                                   null ),( 'T',
                                                                                            10,
                                                                                            1,
                                                                                            null ),( 'F',
                                                                                                     11,
                                                                                                     1,
                                                                                                     1 ),( 'F',
                                                                                                           12,
                                                                                                           1,
                                                                                                           1 ),( 'F',
                                                                                                                 13,
                                                                                                                 2,
                                                                                                                 1 ),( 'F',
                                                                                                                       14,
                                                                                                                       2,
                                                                                                                       2 ),( 'F'
                                                                                                                       ,
                                                                                                                         15,
                                                                                                                         2,
                                                                                                                         2 ),
                                                                                                                         ( 'F'
                                                                                                                         ,
                                                                                                                           16
                                                                                                                           ,
                                                                                                                           2,
                                                                                                                           2 )
                                                                                                                           ,(
                                                                                                                           'F'
                                                                                                                           ,
                                                                                                                             17
                                                                                                                             ,
                                                                                                                             2
                                                                                                                             ,
                                                                                                                             2
                                                                                                                             )
                                                                                                                             ,
                                                                                                                             (
                                                                                                                             'F'
                                                                                                                             ,
                                                                                                                               18
                                                                                                                               ,
                                                                                                                               2
                                                                                                                               ,
                                                                                                                               3
                                                                                                                               )
                                                                                                                               ,
                                                                                                                               (
                                                                                                                               'F'
                                                                                                                               ,
                                                                                                                                 19
                                                                                                                                 ,
                                                                                                                                 2
                                                                                                                                 ,
                                                                                                                                 4
                                                                                                                                 )
                                                                                                                                 ,
                                                                                                                                 (
                                                                                                                                 'F'
                                                                                                                                 ,
                                                                                                                                   20
                                                                                                                                   ,
                                                                                                                                   2
                                                                                                                                   ,
                                                                                                                                   4
                                                                                                                                   )
                                                                                                                                   ,
                                                                                                                                   (
                                                                                                                                   'F'
                                                                                                                                   ,
                                                                                                                                     21
                                                                                                                                     ,
                                                                                                                                     2
                                                                                                                                     ,
                                                                                                                                     5
                                                                                                                                     )
                                                                                                                                     ,
                                                                                                                                     (
                                                                                                                                     'F'
                                                                                                                                     ,
                                                                                                                                       22
                                                                                                                                       ,
                                                                                                                                       2
                                                                                                                                       ,
                                                                                                                                       6
                                                                                                                                       )
                                                                                                                                       ,
                                                                                                                                       (
                                                                                                                                       'T'
                                                                                                                                       ,
                                                                                                                                         23
                                                                                                                                         ,
                                                                                                                                         2
                                                                                                                                         ,
                                                                                                                                         null
                                                                                                                                         )
                                                                                                                                         ,
                                                                                                                                         (
                                                                                                                                         'T'
                                                                                                                                         ,
                                                                                                                                              24
                                                                                                                                              ,
                                                                                                                                              2
                                                                                                                                              ,
                                                                                                                                              null
                                                                                                                                              )
                                                                                                                                              ;

insert into "Payment" ( "name" ) values ( 'BLIK' ),( 'Card' );

insert into "Type" ( "name" ) values ( 'Ticket' ),( 'Reservation' );

insert into "PaymentStatus" ( "name" ) values ( 'Accepted' ),( 'Canceled' );

insert into "Ticket" (
   "ReservationID",
   "PaymentID",
   "date",
   "TypeID",
   "to_be_paid",
   "verified",
   "PaymentStatusID"
) values ( 1,
           1,
           '2025-01-10 14:00:00',
           1,
           15.0,
           'F',
           1 ),( 2,
                 2,
                 '2025-01-10 14:00:00',
                 2,
                 20.0,
                 'F',
                 2 ),( 3,
                       2,
                       '2025-01-10 14:00:00',
                       2,
                       20.0,
                       'F',
                       2 ),( 6,
                             2,
                             '2025-01-10 14:00:00',
                             2,
                             20.0,
                             'F',
                             2 );



insert into "CanceledTicket" (
   "bank_account",
   "date",
   "TicketReservationID"
) values ( '123456789',
           '2024-06-20',
           1 );

insert into "Form" ( "movieFormName" ) values ( '3D' ),( '2D Dubbing' ),( '2D Subbtitles' );