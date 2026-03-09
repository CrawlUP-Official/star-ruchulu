# CUSTOMER ACCOUNT ARCHITECTURE

## Overview
The Customer Account Architecture introduces full authentication and profile management for Star Ruchulu, transitioning it from a pure guest-checkout system to a persistent user tracking ecommerce application. 

## Database Schema
A new table `customers` was created:
```sql
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Backend APIs
- **POST /api/v1/customers/signup**: Takes `name`, `email`, `phone`, `password`, hashes the password via `bcrypt`, and auto-generates a JWT.
- **POST /api/v1/customers/login**: Compares incoming password with `password_hash`, returning a JWT token payload.
- **GET /api/v1/customers/profile**: Fetches base customer data, joins subscriptions by email, and pulls the aggregate array of historical orders. Protected by `authMiddleware`.
- **GET /api/v1/customers/orders**: Specific protected route to fetch structured order items and details specifically tied to the logged-in customer's email.
- **GET /api/v1/customers**: Base index route used securely by the Admin panel (`AdminCustomers.jsx`) to monitor all registered users, total spending, and aggregated purchase count.

## Authentication Strategy
We implemented JSON Web Tokens (`JWT`). 
1. Customer registers/logs in securely.
2. Express uses `jsonwebtoken` to sign a 7-day token.
3. React stores this in `localStorage` as `customerToken`.
4. The `AuthContext` component continuously injects `Bearer <token>` into `Axios` headers dynamically.
5. All backend requests pointing to `/profile` or `/orders` decode the user via `authMiddleware`.

## Frontend Integration
Added `AuthContext` provider bridging React components:
- **`src/pages/account/Login.jsx`**
- **`src/pages/account/Signup.jsx`**
- **`src/pages/account/Dashboard.jsx`**: A private dashboard displaying tracking and subscriptions.
- **`CheckoutAuthModal`**: Protects the standard `/checkout` flow from guests, gracefully pausing the checkout intent without resetting cart state.
- **`Navbar`**: Included a unified `User` icon granting fast access to the profile dashboard.
