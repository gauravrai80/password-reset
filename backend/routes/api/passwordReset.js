const express = require('express');
const router = express.Router();
const passwordResetController = require('../../controllers/passwordResetController');

// Request password reset - sends email with reset link
router.post('/forgot-password', passwordResetController.requestPasswordReset);

// Validate reset token - checks if token is valid
router.get('/reset-password/:token', passwordResetController.validateResetToken);

// Reset password - updates password
router.post('/reset-password/:token', passwordResetController.resetPassword);

module.exports = router;
