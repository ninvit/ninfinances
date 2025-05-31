# Backend Implementation Plan

**Overall Goal:** Create a Node.js backend with MongoDB persistence and authentication to store and retrieve transaction data for the nin.finance application.

**High-Level Plan:**

1.  **Project Setup:** Create a `backend` directory within the existing project. Initialize a `package.json` file and install necessary dependencies.
2.  **Database Model:** Define a Mongoose schema for the transaction data.
3.  **Authentication:** Implement user authentication using a library like `bcrypt` and `jsonwebtoken`.
4.  **API Endpoints:** Implement API endpoints for creating, reading, updating, and deleting transactions, protected by authentication.
5.  **Frontend Integration:** Modify the existing `scripts.js` file to communicate with the new backend API and handle authentication.

**Detailed Plan with Mermaid Diagram:**

```mermaid
graph LR
    A[Frontend (nin.finance)] --> B(Backend (Node.js/Express))
    B --> C{MongoDB}

    subgraph Backend Components
        D[server.js] --> E(Authentication)
        E --> F(User Model)
        E --> G(API Endpoints)
        G --> H(Transaction Model)
        H --> C
    end

    subgraph Authentication
        I[Register]
        J[Login]
        E --> I
        E --> J
    end

    subgraph API Endpoints
        K[/transactions (GET)]
        L[/transactions (POST)]
        M[/transactions/:id (GET)]
        N[/transactions/:id (PUT)]
        O[/transactions/:id (DELETE)]
        G --> K
        G --> L
        G --> M
        G --> N
        G --> O
    end

    subgraph Transaction Model
        P[description: String]
        Q[amount: Number]
        R[date: String]
        H --> P
        H --> Q
        H --> R
    end

    subgraph User Model
        S[username: String]
        T[password: String]
        F --> S
        F --> T
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
    style C fill:#ffc,stroke:#333,stroke-width:2px
```

**Updated Step-by-Step Breakdown:**

1.  **Create `backend` directory:** This will house all backend-related files.
2.  **Initialize `package.json`:** Use `npm init -y` to create a default `package.json` file.
3.  **Install Dependencies:** Install `express`, `mongoose`, `cors`, `bcrypt`, and `jsonwebtoken` using `npm install express mongoose cors bcrypt jsonwebtoken`.
4.  **Create `server.js`:** This file will contain the main server logic.
    *   Import necessary modules (`express`, `mongoose`, `cors`, `bcrypt`, `jsonwebtoken`).
    *   Define the connection string to MongoDB (provided by the user).
    *   Connect to MongoDB using Mongoose.
    *   Set up middleware (e.g., `cors`, `express.json`).
    *   Define authentication routes (`/register`, `/login`).
    *   Define API routes (see "API Endpoints" subgraph above), protected by authentication middleware.
    *   Start the server and listen on a specific port (e.g., 3000).
5.  **Create `models/transaction.js`:** This file will define the Mongoose schema for transactions.
    *   Import Mongoose.
    *   Define the schema with fields for `description`, `amount`, and `date` (see "Transaction Model" subgraph above).
    *   Create a Mongoose model based on the schema.
6.  **Create `models/user.js`:** This file will define the Mongoose schema for users.
    *   Import Mongoose.
    *   Define the schema with fields for `username` and `password` (see "User Model" subgraph above).
    *   Create a Mongoose model based on the schema.
7.  **Implement Authentication:** In `server.js`, implement the following authentication routes:
    *   `POST /register`: Create a new user account.
        *   Hash the password using `bcrypt`.
        *   Save the user to the database.
    *   `POST /login`: Authenticate an existing user.
        *   Find the user in the database by username.
        *   Compare the provided password with the stored hash using `bcrypt`.
        *   If the passwords match, generate a JWT token using `jsonwebtoken`.
        *   Send the token to the client.
8.  **Implement Authentication Middleware:** Create a middleware function to verify JWT tokens.
    *   Extract the token from the `Authorization` header.
    *   Verify the token using `jsonwebtoken`.
    *   If the token is valid, attach the user ID to the request object.
    *   If the token is invalid, return an error.
9.  **Protect API Endpoints:** Apply the authentication middleware to all API endpoints that require authentication (e.g., `/transactions`).
10. **Frontend Integration:** Modify `scripts.js` to communicate with the backend API and handle authentication.
    *   Add functions for registering and logging in.
    *   Store the JWT token in local storage.
    *   Include the token in the `Authorization` header for all requests to the API.
    *   Redirect the user to the login page if their token is invalid or expired.