# Green Circle

Green Circle is a full-stack web application for hyperlocal rentals and trust-enabled marketplace interactions. It combines a React/Vite frontend with a Spring Boot backend and PostgreSQL persistence.

Live demo: https://green-circle-rust.vercel.app/

## Overview
This project enables users to browse local rental products, register and log in, place rental orders, and manage escrow-style transactions. The backend exposes REST APIs for authentication, product discovery, and order lifecycle management.

## Features
- User registration and login
- Hyperlocal discovery of rental products by location and radius
- Product listings with daily rental price, deposit amount, and images
- Rental order creation, updates, retrieval, and deletion
- Escrow workflow and OTP handover support in the backend
- Frontend components for cart/checkout, notifications, profile, orders, and admin management

## Technology stack
- Frontend: React, Vite, JavaScript, CSS
- Backend: Spring Boot 4.1, Java 25, Spring Web MVC, Spring Data JPA
- Database: PostgreSQL runtime driver
- ORM: Jakarta Persistence (JPA) with Lombok entities

## Backend structure
- `Green_Circle/src/main/java/com/example/Green_Circle/GreenCircleApplication.java`
- Controllers: `AuthController`, `HomeController`, `OrderController`
- Entities: `User`, `Product`, `Rental`
- Repositories: `UserRepository`, `ProductRepository`, `RentalRepository`
- Services: `DisputeEngineService`, `OtpHandoverService`

## Frontend structure
- `frontend/src/App.jsx`
- `frontend/src/components/` contains the UI pages and modals
- `frontend/src/services/` contains API client modules
- `frontend/src/utils/appUtils.js` contains shared helper functions

## Running the project
### Backend
```bash
cd Green_Circle
./mvnw spring-boot:run
```
On Windows:
```bash
cd Green_Circle
mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes
- The backend currently stores plain text passwords in the database. For production, add Spring Security and use `BCryptPasswordEncoder` to hash user passwords.
- The frontend and backend are separated into `frontend/` and `Green_Circle/` folders.

## GitHub display
This `README.md` will appear on GitHub as the main project description when the repository is viewed.
