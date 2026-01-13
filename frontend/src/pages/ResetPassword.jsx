import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { validateResetToken, resetPassword } from '../services/api';
import '../styles/PasswordReset.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Validate token on component mount
    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await validateResetToken(token);
                setTokenValid(true);
                setUserEmail(response.email);
                setMessage({ type: 'info', text: 'Please enter your new password below.' });
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Invalid or expired reset token.';
                setMessage({ type: 'danger', text: errorMessage });
                setTokenValid(false);

                // Redirect to forgot password page after 5 seconds
                setTimeout(() => {
                    navigate('/forgot-password');
                }, 5000);
            } finally {
                setValidating(false);
            }   
        };

        if (token) {
            checkToken();
        }
    }, [token, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters long';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage({ type: '', text: '' });

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(token, newPassword);
            setMessage({
                type: 'success',
                text: response.message || 'Password reset successful! Redirecting to login...'
            });
            setNewPassword('');
            setConfirmPassword('');

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
            setMessage({ type: 'danger', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="password-reset-page">
                <Container>
                    <Row className="justify-content-center align-items-center min-vh-100">
                        <Col md={6} lg={5}>
                            <Card className="shadow-lg border-0 rounded-4">
                                <Card.Body className="p-5 text-center">
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="text-muted">Validating reset token...</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="password-reset-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <div className="icon-wrapper mb-3">
                                        <i className={`bi ${tokenValid ? 'bi-shield-check' : 'bi-shield-x'}`}></i>
                                    </div>
                                    <h2 className="fw-bold">Reset Password</h2>
                                    {tokenValid && userEmail && (
                                        <p className="text-muted">
                                            Resetting password for: <strong>{userEmail}</strong>
                                        </p>
                                    )}
                                </div>

                                {message.text && (
                                    <Alert variant={message.type} className="animate-fade-in">
                                        {message.text}
                                    </Alert>
                                )}

                                {tokenValid && (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <i className="bi bi-key me-2"></i>
                                                New Password
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                isInvalid={!!errors.newPassword}
                                                className="py-2"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.newPassword}
                                            </Form.Control.Feedback>
                                            <Form.Text className="text-muted">
                                                Password must be at least 6 characters long
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold">
                                                <i className="bi bi-key-fill me-2"></i>
                                                Confirm Password
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                isInvalid={!!errors.confirmPassword}
                                                className="py-2"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
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
                                                    Resetting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Reset Password
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                )}

                                {!tokenValid && (
                                    <div className="text-center mt-3">
                                        <p className="text-muted">Redirecting to forgot password page...</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResetPassword;
