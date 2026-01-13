const User = require('../model/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendPasswordResetEmail } = require('../config/emailService');

// Request password reset - generates token and sends email
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Generate random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        // Hash token before storing in database
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Update user with reset token
        // Using findOneAndUpdate avoids triggering validation on existing fields (like missing username)
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: Date.now() + 3600000 // 1 hour
            },
            { new: true }
        );

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email address' });
        }

        // Send email with reset link
        try {
            await sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({
                message: 'Password reset email sent successfully. Please check your inbox.',
                // Only send token in development for testing
                ...(process.env.NODE_ENV === 'development' && { resetToken })
            });
        } catch (emailError) {
            // Clear token if email fails
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return res.status(500).json({
                message: 'Failed to send password reset email. Please try again later.'
            });
        }

    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        // Return actual error message for debugging
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Validate reset token - checks if token is valid and not expired
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Reset token is required' });
        }

        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with this token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } // Check if not expired
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token. Please request a new password reset.'
            });
        }

        res.status(200).json({
            message: 'Token is valid',
            email: user.email
        });

    } catch (error) {
        console.error('Error in validateResetToken:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset password - updates password and clears token
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validate inputs
        if (!token) {
            return res.status(400).json({ message: 'Reset token is required' });
        }

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token fields
        // Using findOneAndUpdate to bypass validation on other fields
        const user = await User.findOneAndUpdate(
            {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() }
            },
            {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token. Please request a new password reset.'
            });
        }

        res.status(200).json({
            message: 'Password has been reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    requestPasswordReset,
    validateResetToken,
    resetPassword
};
