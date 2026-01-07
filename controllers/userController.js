const User = require('../model/user');

const getUserInfo = async (req, res) => {
    try {
        // User info is already in req.user from the JWT middleware
        const { userId, username, email } = req.user;

        // Optionally fetch fresh data from database
        const user = await User.findById(userId).select('-password').exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Get user info error:', err);
        return res.status(500).json({ message: 'Server error retrieving user information' });
    }
}

module.exports = { getUserInfo };
