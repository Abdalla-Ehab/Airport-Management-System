# Airport Management System (twixNexus)

A comprehensive airport management platform built with Spring Boot and Vanilla JavaScript.

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Java 21+ (for local development)
- Maven (for local development)

### Running with Docker
The easiest way to run the system is using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at [http://localhost:8080](http://localhost:8080).

## 📂 Project Structure

This project follows a clean, layered architecture inspired by modern system designs:

- **Frontend**: Integrated into `backend/src/main/resources`.
  - `static/`: Contains `style.css` and `script.js`.
  - `templates/`: Contains `index.html`.
- **Backend**: Spring Boot application in `backend/`.
  - `controller/`: REST APIs.
  - `service/`: Business logic layer.
  - `repository/`: Data access layer.
  - `entity/`: Database models.
  - `exception/`: Global error handling.
  - `security/`: JWT and Spring Security configuration.

## 🛠 Features
- **Passenger Portal**: Flight searching, booking, and check-in.
- **Staff Portal**: Fleet management, flight scheduling, and baggage tracking.
- **Security**: JWT-based authentication with role-based access control (RBAC).
- **Maintenance**: Real-time aircraft status monitoring and grounding.

## 📄 Documentation
For more details on the architecture, see [system_design.md](./system_design.md).