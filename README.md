# Authentication System - Full Stack

A complete authentication system with a modern React frontend and Node.js/Express backend. Features include user registration, login, and password reset functionality with a premium, responsive UI.

## 🚀 Project Structure

This is a monorepo containing both frontend and backend:

```
auth/
├── backend/           # Node.js/Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   └── index.js
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── index.html
└── README.md         # This file
```

## ✨ Features

### Backend
- User registration and login with JWT authentication
- Password reset via email with token expiry
- Secure password hashing with bcrypt
- MongoDB database with Mongoose
- Email service with Nodemailer
- Input validation and error handling
- RESTful API design

### Frontend
- Modern, responsive UI with glassmorphism effects
- Animated gradient backgrounds
- Login and registration pages
- Forgot password and reset password flows
- Password visibility toggle
- Form validation
- Mobile-first responsive design
- Bootstrap 5 + Custom CSS

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Nodemailer
- CORS

### Frontend
- React 18
- Vite
- React Router DOM
- Bootstrap 5
- Axios
- Google Fonts (Inter)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account (for email service)
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd auth
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ACCESS_TOKEN_SECRET=your_secret_key_here

# Server Port
PORT=3000

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

**Important:** For `EMAIL_PASSWORD`, use a Gmail App Password (not your regular password):
1. Go to Google Account → Security → 2-Step Verification
2. Scroll to "App passwords"
3. Generate a password for "Mail"
4. Use the 16-character password in your `.env` file

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎨 UI Features

- **Modern Design**: Glassmorphism effects with animated gradient backgrounds
- **Responsive**: Mobile-first design that works on all devices (320px to 4K)
- **Animations**: Smooth transitions, hover effects, and micro-interactions
- **Accessibility**: Keyboard navigation, ARIA labels, and focus states
- **Touch-Optimized**: Touch-friendly buttons and inputs for mobile devices

## 📚 API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /auth` - Login user
- `GET /user` - Get user info (protected)

### Password Reset
- `POST /forgot-password` - Request password reset email
- `GET /reset-password/:token` - Validate reset token
- `POST /reset-password/:token` - Reset password with token

For detailed API documentation, see [backend/README.md](backend/README.md) or import the Postman collection from `backend/auth-api.postman_collection.json`.

## 🧪 Testing

### Using Postman
1. Import `backend/auth-api.postman_collection.json`
2. Set `base_url` to `http://localhost:3000`
3. Test all endpoints with example requests

### Manual Testing
1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Test the complete flow:
   - Register a new account
   - Login with credentials
   - Test forgot password flow
   - Reset password with email link

## 🌐 Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com/)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`
6. Add all environment variables from `.env`
7. Deploy!

### Frontend (Netlify)
1. Create a new site on [Netlify](https://netlify.com/)
2. Connect your GitHub repository
3. Set **Base directory** to `frontend`
4. Set **Build command** to `npm run build`
5. Set **Publish directory** to `frontend/dist`
6. Add environment variable: `VITE_API_URL=<your-render-backend-url>`
7. Deploy!

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 1-hour expiration
- Password reset tokens expire after 1 hour
- CORS protection
- Input validation and sanitization
- Secure HTTP-only cookies (optional)
- Environment variables for sensitive data

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

## 🎯 Pages

1. **Login** (`/` or `/login`) - User login with forgot password link
2. **Register** (`/register`) - New user registration
3. **Forgot Password** (`/forgot-password`) - Request password reset email
4. **Reset Password** (`/reset-password/:token`) - Reset password with token

## 📝 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

## 🐛 Common Issues

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all environment variables are set

### Email not sending
- Use Gmail App Password, not regular password
- Enable 2-Step Verification on Google Account
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check VITE_API_URL in frontend `.env`
- Check CORS configuration in backend

## 📄 License

This project is open-source and available for educational purposes.

## 👤 Author

Gaurav Rai

---

**Note**: This is a learning project. For production use, consider additional security measures like rate limiting, refresh tokens, and more comprehensive error handling.
