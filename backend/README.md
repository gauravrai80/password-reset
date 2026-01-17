# Authentication API - Backend

Node.js/Express backend for the authentication system with JWT-based authentication and password reset functionality.

## Features

- User registration and login
- JWT-based authentication
- Password reset via email
- MongoDB database
- Input validation
- Secure password hashing with bcrypt

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer (local) / SendGrid API (production)
- **Validation**: express-validator

## Project Structure

```
backend/
├── config/
│   ├── allowedOrigins.js    # CORS configuration
│   └── dbConn.js             # MongoDB connection
├── controllers/
│   ├── authController.js           # Login logic
│   ├── registerController.js       # Registration logic
│   ├── userController.js           # User data retrieval
│   └── passwordResetController.js  # Password reset logic
├── middleware/
│   └── verifyJWT.js          # JWT verification middleware
├── model/
│   └── user.js               # User model schema
├── routes/
│   ├── api/
│   │   ├── auth.js           # Auth routes
│   │   ├── register.js       # Registration routes
│   │   ├── user.js           # User routes
│   │   └── passwordReset.js  # Password reset routes
│   └── root.js               # Root route
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment variables template
├── index.js                  # Server entry point
└── package.json              # Dependencies

```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret
ACCESS_TOKEN_SECRET=your_jwt_secret_key

# Server Port
PORT=3000

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SendGrid API Key (REQUIRED for Render deployment - see troubleshooting below)
SENDGRID_API_KEY=your_sendgrid_api_key

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### Email Service Configuration

The application supports **two email delivery methods**:

1. **SMTP (Gmail)** - For local development
2. **SendGrid API** - For production deployment (Render, Heroku, etc.)

The system automatically detects which method to use:
- If `SENDGRID_API_KEY` is set → Uses SendGrid API
- If `SENDGRID_API_KEY` is not set → Uses SMTP (Gmail)

### ⚠️ IMPORTANT: Render Deployment Email Issue

**Problem**: Render.com blocks SMTP ports (25, 465, 587) on **free tier** instances, causing email sending to fail with `ETIMEDOUT` errors.

**Solution**: Use SendGrid API instead of SMTP.

#### SendGrid Setup (Required for Render):

1. **Create SendGrid Account**
   - Sign up at [sendgrid.com](https://sendgrid.com/) (free tier: 100 emails/day)

2. **Verify Sender Email**
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Use the same email as your `EMAIL_USER`
   - Check inbox and verify

3. **Create API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Choose "Full Access" or "Restricted Access" with "Mail Send" permission
   - Copy the API key (shown only once!)

4. **Add to Render Environment**
   - Render Dashboard → Your Service → Environment
   - Add: `SENDGRID_API_KEY` = `SG.xxxxxxxxxx.yyyyyyyyyyyy`
   - Save (auto-redeploys)

**Note**: Local development will continue using Gmail SMTP unless you add `SENDGRID_API_KEY` to your local `.env`.

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your values

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /auth` - Login user
- `GET /user` - Get user info (protected)

### Password Reset
- `POST /forgot-password` - Request password reset email
- `GET /reset-password/:token` - Validate reset token
- `POST /reset-password/:token` - Reset password with token

## API Documentation

Import the `auth-api.postman_collection.json` file into Postman to see all available endpoints with example requests and responses.

## Deployment

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- HTTP-only cookies (if implemented)
- CORS protection
- Input validation and sanitization
- Password reset tokens with expiration (1 hour)


