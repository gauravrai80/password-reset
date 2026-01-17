const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const testSMTP = async () => {
    console.log('Starting SMTP Verification...');

    const port = parseInt(process.env.EMAIL_PORT) || 587;
    const config = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000
    };

    console.log('Config:', { ...config, auth: { ...config.auth, pass: '*****' } });

    const transporter = nodemailer.createTransport(config);

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully.');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'SMTP Verification Test',
            text: 'This is a test email to verify the SMTP configuration and connection.'
        });
        console.log('✅ Email sent successfully:', info.messageId);

    } catch (error) {
        console.error('❌ SMTP Verification Failed:', error);
    } finally {
        transporter.close();
        console.log('Transporter closed.');
        process.exit(0);
    }
};

testSMTP();
