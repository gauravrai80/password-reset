# Deployment Guide - Render

This guide will walk you through deploying your User Authentication API to Render.

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com/)
- Your code pushed to a GitHub repository

## Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - User Authentication API"
   ```

2. **Create a new repository on GitHub**

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Create a Web Service on Render

1. **Log in to Render** at https://render.com/

2. **Click "New +"** in the top right corner

3. **Select "Web Service"**

4. **Connect your GitHub repository:**
   - Click "Connect account" if you haven't connected GitHub yet
   - Find and select your authentication API repository
   - Click "Connect"

## Step 3: Configure Your Service

Fill in the following settings:

### Basic Settings:
- **Name**: `user-auth-api` (or your preferred name)
- **Region**: Choose the closest region to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave blank (unless your code is in a subdirectory)

### Build Settings:
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Instance Type:
- Select **Free** tier for testing (or paid tier for production)

## Step 4: Add Environment Variables

Scroll down to the **Environment Variables** section and add the following:

1. **MONGO_URI**
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

2. **ACCESS_TOKEN_SECRET**
   - **Key**: `ACCESS_TOKEN_SECRET`
   - **Value**: Your JWT secret key (64+ character random string)
   - Generate one using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **PORT** (Optional - Render sets this automatically)
   - **Key**: `PORT`
   - **Value**: Render will set this automatically, you don't need to add it

### How to Add Environment Variables:
- Click "Add Environment Variable"
- Enter the Key and Value
- Click "Save"
- Repeat for each variable

## Step 5: Deploy

1. **Click "Create Web Service"** at the bottom

2. **Wait for deployment** - This usually takes 2-5 minutes
   - You'll see the build logs in real-time
   - Look for "Successfully Connected to MongoDB" and "Server is running on port..."

3. **Your API is live!** 
   - Render will provide you with a URL like: `https://user-auth-api.onrender.com`

## Step 6: Test Your Deployed API

### Using Postman:

1. **Import the Postman collection** (`auth-api.postman_collection.json`)

2. **Update the base_url variable**:
   - Change from `http://localhost:3000`
   - To your Render URL: `https://your-app-name.onrender.com`

3. **Test the endpoints**:
   - POST `/register` - Register a new user
   - POST `/auth` - Login and get token
   - GET `/user` - Get user info (with Bearer token)

### Using cURL:

```bash
# Test API Info
curl https://your-app-name.onrender.com/

# Register a user
curl -X POST https://your-app-name.onrender.com/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-app-name.onrender.com/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get user info (replace YOUR_TOKEN with the token from login)
curl https://your-app-name.onrender.com/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Step 7: Monitor Your Deployment

1. **View Logs**: Click on "Logs" tab in Render dashboard
2. **Monitor Metrics**: Check the "Metrics" tab for performance
3. **Set up Alerts**: Configure email alerts for downtime (optional)

## Important Notes

### Free Tier Limitations:
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after inactivity may take 30-60 seconds (cold start)
- 750 hours/month of free usage
- For production, consider upgrading to a paid plan

### MongoDB Atlas Setup:
Make sure your MongoDB Atlas cluster allows connections from anywhere:
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs)
3. Or add Render's IP addresses specifically

### CORS Configuration:
Update your CORS whitelist in `index.js` to include your Render URL:
```javascript
const whitelist = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-app-name.onrender.com'  // Add your Render URL
];
```

## Troubleshooting

### Build Fails:
- Check that `package.json` has correct scripts
- Verify all dependencies are listed
- Check build logs for specific errors

### Server Crashes:
- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Review logs for error messages

### Can't Connect to MongoDB:
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

### 401/403 Errors:
- Verify `ACCESS_TOKEN_SECRET` is set
- Check token is being sent in Authorization header
- Ensure token hasn't expired (1 hour expiration)

## Updating Your Deployment

Render automatically redeploys when you push to your connected branch:

```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```

Render will detect the push and automatically rebuild and redeploy.

## Submission Checklist

✅ Server deployed on Render  
✅ All environment variables configured  
✅ API endpoints tested and working  
✅ GitHub repository is public  
✅ README.md is complete  
✅ Postman collection is included  

### URLs to Submit:
1. **Render URL**: `https://your-app-name.onrender.com`
2. **GitHub Repository**: `https://github.com/yourusername/your-repo-name`

---

**Congratulations! Your User Authentication API is now live! 🎉**
