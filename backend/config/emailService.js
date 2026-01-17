const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Determine which email service to use
const useSendGrid = !!process.env.SENDGRID_API_KEY;

if (useSendGrid) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('Using SendGrid API for email delivery');
} else {
    console.log('Using SMTP (Nodemailer) for email delivery');
}

// Create transporter for sending emails (SMTP fallback)
const createTransporter = () => {
    const port = parseInt(process.env.EMAIL_PORT) || 465;
    const isSecure = port === 465;

    console.log('Initializing SMTP Transport with config:', {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: port,
        secure: isSecure,
        user: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_PASSWORD
    });

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: port,
        secure: isSecure,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        logger: true,
        debug: true,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000
    });
};

// Generate email HTML template
const generateEmailHTML = (resetUrl) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>You requested to reset your password. Click the button below to reset your password:</p>
                    <p style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </p>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 3px;">
                        ${resetUrl}
                    </p>
                    <div class="warning">
                        <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
                    </div>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply.</p>
                    <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Send password reset email using SendGrid
const sendWithSendGrid = async (email, resetUrl) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_USER, // Must be verified sender in SendGrid
        subject: 'Password Reset Request',
        html: generateEmailHTML(resetUrl)
    };

    try {
        const response = await sgMail.send(msg);
        console.log('SendGrid email sent successfully:', response[0].statusCode);
        return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
        console.error('SendGrid Error:', error.response?.body || error);
        throw new Error('Failed to send password reset email via SendGrid');
    }
};

// Send password reset email using SMTP
const sendWithSMTP = async (email, resetUrl) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Password Reset" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: generateEmailHTML(resetUrl)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('SMTP email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('SMTP Error:', error.message);
        throw new Error('Failed to send password reset email via SMTP');
    }
};

// Main send function - routes to appropriate service
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    if (useSendGrid) {
        return await sendWithSendGrid(email, resetUrl);
    } else {
        return await sendWithSMTP(email, resetUrl);
    }
};

// Verify connection (only for SMTP)
const verifyConnection = async () => {
    if (useSendGrid) {
        console.log('Using SendGrid - no connection verification needed');
        return true;
    }

    const transporter = createTransporter();
    try {
        await transporter.verify();
        console.log('SMTP Connection Verified Successfully');
        return true;
    } catch (error) {
        console.error('SMTP Connection Failed:', error);
        return false;
    }
};

module.exports = { sendPasswordResetEmail, verifyConnection };
