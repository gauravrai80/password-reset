const User = require('../model/user');
const bcrypt = require('bcrypt');

const registerNewUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    try {
        // Check for duplicate username
        const duplicateUsername = await User.findOne({ username: username }).exec();
        if (duplicateUsername) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Check for duplicate email
        const duplicateEmail = await User.findOne({ email: email }).exec();
        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const result = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        console.log('New user created:', result.username);
        res.status(201).json({
            message: `User ${username} registered successfully`,
            user: {
                username: result.username,
                email: result.email
            }
        });

    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Server error during registration' });
    }
}

module.exports = { registerNewUser };
