require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/dbConn');
connectDB();
const { verifyConnection } = require('./config/emailService');

// Verify email connection on startup
verifyConnection();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

app.use(cookieParser());

// CORS configuration
const whitelist = ['http://localhost:3000', 'http://localhost:5173', 'https://resetpasswd.netlify.app'];
const corsOptions = {
    origin: whitelist,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root route - API info
app.get('/', (req, res) => {
    res.json({
        message: 'User Authentication API',
        version: '1.0.0',
        endpoints: {
            register: 'POST /register',
            login: 'POST /auth',
            getUserInfo: 'GET /user (requires Bearer token)',
            forgotPassword: 'POST /forgot-password',
            validateResetToken: 'GET /reset-password/:token',
            resetPassword: 'POST /reset-password/:token'
        }
    });
});

// Public routes
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/', require('./routes/api/passwordReset'));

// Protected routes
app.use('/user', require('./routes/api/user'));

// Start server after MongoDB connection
mongoose.connection.once('open', () => {
    console.log('Successfully Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
