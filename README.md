# User Authentication API

A secure Node.js REST API implementing user authentication and authorization using Bearer tokens (JWT). Built with Express.js, MongoDB, and following the MVC architectural pattern.

## 🚀 Features

- **User Registration** - Create new user accounts with username, email, and password
- **Secure Authentication** - Login with JWT-based authentication
- **Password Security** - Passwords are hashed using bcrypt before storage
- **Protected Routes** - JWT middleware to protect sensitive endpoints
- **User Information Retrieval** - Get authenticated user details
- **Input Validation** - Comprehensive validation for all user inputs
- **Error Handling** - Consistent error responses across all endpoints

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your values:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_secret_key_here
   PORT=3000
   ```

   **Generate a secure ACCESS_TOKEN_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Start the server**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. **Register User**
- **Endpoint:** `POST /register`
- **Description:** Create a new user account
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "User johndoe registered successfully",
    "user": {
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

### 2. **Login**
- **Endpoint:** `POST /auth`
- **Description:** Authenticate user and receive JWT token
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securePassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

### 3. **Get User Info** (Protected)
- **Endpoint:** `GET /user`
- **Description:** Retrieve authenticated user information
- **Headers:**
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Success Response (200):**
  ```json
  {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

## 🔒 Authentication

This API uses **Bearer Token** authentication. After logging in, include the JWT token in the `Authorization` header for protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires after **1 hour**.

## 📁 Project Structure

```
auth/
├── config/
│   └── dbConn.js          # MongoDB connection configuration
├── controllers/
│   ├── authControllers.js  # Login logic
│   ├── registerController.js # Registration logic
│   └── userController.js   # User info retrieval
├── middleware/
│   └── verifyJWT.js        # JWT verification middleware
├── model/
│   └── user.js             # User schema/model
├── routes/
│   └── api/
│       ├── auth.js         # Login routes
│       ├── register.js     # Registration routes
│       └── user.js         # User info routes
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
├── index.js                # Application entry point
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## 🧪 Testing with Postman

1. Import the Postman collection: `auth-api.postman_collection.json`
2. Set up environment variables in Postman:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set automatically after login)

### Test Flow:
1. **Register** a new user
2. **Login** with credentials (copy the `accessToken`)
3. **Get User Info** using the token in Authorization header

## 🌐 Deployment on Render

1. **Create a new Web Service** on [Render](https://render.com/)

2. **Connect your GitHub repository**

3. **Configure the service:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   - `MONGO_URI`: Your MongoDB connection string
   - `ACCESS_TOKEN_SECRET`: Your JWT secret key
   - `PORT`: (Optional, Render sets this automatically)

5. **Deploy** and test your live API!

## 🔐 Security Best Practices

- ✅ Passwords are hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens expire after 1 hour
- ✅ Environment variables for sensitive data
- ✅ Input validation on all endpoints
- ✅ Email format validation
- ✅ Duplicate username/email checks
- ✅ CORS configuration for allowed origins

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (expired token)
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `500` - Internal Server Error

## 📝 License

This project is open-source and available for educational purposes.

## 👤 Author

Gaurav Rai

