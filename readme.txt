1. Basic Setup (Express.js)
First, set up an Express.js server, where users can register, login, and book rides. Integrated bcrypt for hashing passwords, JWT for token-based authentication, and mongoose to interact with MongoDB.

2. Core Functionalities:

User Authentication
Register a user and hash their password using bcrypt.
Login and generate a JWT token for secure access to the API.
Middleware to verify JWT on protected routes.

Ride Booking
Endpoints for booking a ride (for cars, bikes, and autos).
Store booking details in MongoDB using Mongoose.
OTP generation and sharing logic.
Ride confirmation by the captain.

Maps Integration
Google Cloud Maps API to assist with navigation, distance calculation.

3. Deployment and Testing:
Made environment variables (.env) for sensitive data such as JWT secrets, MongoDB URI, and Google Maps API keys.

Used Postman to test the API endpoints.