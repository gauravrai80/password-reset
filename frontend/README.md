# Password Reset Flow - Frontend

A modern React application for password reset functionality with email verification.

## 🚀 Features

- Forgot password page with email validation
- Password reset page with token validation
- Expiry handling with user alerts
- Responsive Bootstrap UI
- Modern gradient design
- Form validation
- API integration with backend

## 🛠️ Tech Stack

- React 18
- Vite
- React Router DOM
- Bootstrap 5
- React Bootstrap
- Axios
- Bootstrap Icons

## 📋 Prerequisites

- Node.js
- npm 

## ⚙️ Installation

1. **Install dependencies**
   
   npm install

2. **Set up environment variables**
   
   Create a `.env` file:
   Update with your backend URL:
   VITE_API_URL=http://localhost:3000


3. **Start development server**
   npm run dev

The app will start on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── ForgotPassword.jsx    # Forgot password page
│   │   └── ResetPassword.jsx     # Password reset page
│   ├── services/
│   │   └── api.js                # API service
│   ├── styles/
│   │   └── PasswordReset.css     # Custom styles
│   ├── App.jsx                   # Main app with routing
│   └── main.jsx                  # Entry point
├── .env.example                  # Environment template
├── netlify.toml                  # Netlify config
└── package.json


## 🌐 Deployment on Netlify

1. **Build the application**
   npm run build

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: npm run build
   - Set publish directory: dist
   - Add environment variable: VITE_API_URL=https://your-backend.onrender.com

3. **Deploy!**

## 📱 Pages

### Forgot Password (`/forgot-password`)
- Email input form
- Email validation
- Success/error messages
- Sends reset link to email

### Reset Password (`/reset-password/:token`)
- Token validation on load
- Password input with confirmation
- Password strength validation
- Expiry handling
- Auto-redirect on success/failure

## 🎨 Features

- **Responsive Design**: Works on all devices
- **Modern UI**: Gradient backgrounds, smooth animations
- **Form Validation**: Client-side validation for better UX
- **Error Handling**: Clear error messages
- **Loading States**: Visual feedback during API calls
- **Auto-redirect**: Automatic navigation after success/expiry

