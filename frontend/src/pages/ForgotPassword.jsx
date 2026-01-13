import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { requestPasswordReset } from '../services/api';
import '../styles/PasswordReset.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage({ type: '', text: '' });

        // Validation
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await requestPasswordReset(email);
            setMessage({
                type: 'success',
                text: response.message || 'Password reset email sent! Please check your inbox.'
            });
            setEmail('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
            setMessage({ type: 'danger', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-reset-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <div className="icon-wrapper mb-3">
                                        <i className="bi bi-lock-fill"></i>
                                    </div>
                                    <h2 className="fw-bold">Forgot Password?</h2>
                                    <p className="text-muted">
                                        No worries! Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                {message.text && (
                                    <Alert variant={message.type} className="animate-fade-in">
                                        {message.text}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-envelope me-2"></i>
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isInvalid={!!errors.email}
                                            className="py-2"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send me-2"></i>
                                                Send Reset Link
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <a href="/" className="text-decoration-none">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Login
                                    </a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ForgotPassword;
