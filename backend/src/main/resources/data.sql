-- Airports
INSERT INTO airport (airport_id, name, city, country, iata_code) VALUES (1, 'Cairo International Airport', 'Cairo', 'Egypt', 'CAI');
INSERT INTO airport (airport_id, name, city, country, iata_code) VALUES (2, 'London Heathrow Airport', 'London', 'UK', 'LHR');
INSERT INTO airport (airport_id, name, city, country, iata_code) VALUES (3, 'John F. Kennedy International Airport', 'New York', 'USA', 'JFK');

-- Airlines
INSERT INTO airline (airline_id, name, iata_code) VALUES (1, 'EgyptAir', 'MS');
INSERT INTO airline (airline_id, name, iata_code) VALUES (2, 'British Airways', 'BA');

-- Aircraft
INSERT INTO aircraft (aircraft_id, registration_no, type, airline_id, number_of_seats, status) VALUES (1, 'SU-GDM', 'Boeing 737', 1, 160, 'ACTIVE');
INSERT INTO aircraft (aircraft_id, registration_no, type, airline_id, number_of_seats, status) VALUES (2, 'G-EUPY', 'Airbus A319', 2, 144, 'ACTIVE');

-- Flights
INSERT INTO flight (flight_id, flight_number, departure_airport_id, arrival_airport_id, aircraft_id, departure_time, arrival_time, status) 
VALUES (1, 'MS201', 1, 2, 1, '2026-05-09 10:00:00', '2026-05-09 15:00:00', 'SCHEDULED');
INSERT INTO flight (flight_id, flight_number, departure_airport_id, arrival_airport_id, aircraft_id, departure_time, arrival_time, status) 
VALUES (2, 'BA123', 2, 3, 2, '2026-05-09 12:00:00', '2026-05-09 20:00:00', 'SCHEDULED');

-- Users (Passengers and Staff)
-- Note: In a real system, passwords would be hashed. For this test, we assume the Auth system handles them or we use the plain ones if the system allows.
-- Assuming 'passenger' and 'staff' tables have the structure found in the SQL backup.
INSERT INTO passenger (passenger_id, passport_no, first_name, last_name, username, password, email, phone_number, dob) 
VALUES (1, 'A1234567', 'John', 'Doe', 'johndoe', '123', 'john@example.com', '0123456789', '1990-01-01');

INSERT INTO staff (staff_id, dept_id, first_name, last_name, username, password, email, phone_number, role, hire_date) 
VALUES (1, 1, 'Admin', 'User', 'admin', '123', 'admin@airport.com', '0987654321', 'ADMIN', '2024-01-01');
