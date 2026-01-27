# 🚀 Node Auth API

A robust and secure backend authentication system built for a technical assessment. 
This project implements a full user lifecycle, featuring **JWT-based authorization**, **Prisma ORM**, 
and automated interactive documentation via **Swagger UI**.

## 🛠 Tech Stack
* **Framework:** Node.js + Express.js
* **Database:** PostgreSQL / MySQL (via Prisma)
* **Security:** JWT (jsonwebtoken) & bcryptjs
* **Documentation:** Swagger (OpenAPI 3.0)
* **Mailing:** SendGrid API / Nodemailer

---

## 📥 Setup & Installation

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:IrynaShashko/node-auth-prisma.git
    cd node-auth-prisma
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    PORT=3000
    DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"
    JWT_SECRET="your_secret_key"
    SENDGRID_API_KEY="your_secret_api_key"
    EMAIL_FROM="your-email@example.com"
    ```

4.  **Database Migration:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run the Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser to view the API documentation.

---

## 🧩 Component Overview

### 1. Authentication System
Secure entry points for managing user sessions and access control.
* **Features:** Secure registration with password hashing, login with JWT issuance, and session logout.
* **Logic:** Utilizes `bcryptjs` with 10 salt rounds for industry-standard password security.

### 2. Profile Management
Authorized endpoints for user-specific operations and account settings.
* **Features:** Fetch authenticated user data and secure password update functionality.
* **Security:** Protected by custom JWT middleware to ensure strict data privacy.

### 3. Password Recovery
A complete system for regaining account access via automated email integration.
* **Features:** Forgot password request (crypto-token generation) and secure reset via email link.
* **Behavior:** Tokens feature a 1-hour expiration window for maximum security.

---

## 📁 Project Structure
To maintain a clean and scalable codebase, the project follows a modular architectural pattern. All database logic is handled via Prisma, and documentation is generated directly from the swagger configuration.

```text
src/
├── lib/
│   ├── mailer.js        # Email service configuration
│   └── prisma.js        # Prisma client initialization
├── middleware/
│   ├── auth.js          # JWT verification middleware
│   └── validators.js    # Joi validation schemas
├── routes/
│   └── auth.js          # Authentication & user routes
├── server.js            # Main entry point & Express config
└── swagger.js           # Swagger UI documentation settings