const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const foundUser = await User.findOne({ username: username }).exec();
        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Verify password
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate access token with user info
        const accessToken = jwt.sign(
            {
                userId: foundUser._id,
                username: foundUser.username,
                email: foundUser.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken,
            user: {
                username: foundUser.username,
                email: foundUser.email
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }
}

module.exports = { handleLogin };
