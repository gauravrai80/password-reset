import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { login } from '../services/api';
import '../styles/PasswordReset.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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
            const response = await login(formData.username, formData.password);
            setMessage({
                type: 'success',
                text: 'Login successful! Welcome back.'
            });

            // Store token if needed
            if (response.accessToken) {
                localStorage.setItem('accessToken', response.accessToken);
            }

            // Redirect to dashboard or home after successful login
            setTimeout(() => {
                // navigate('/dashboard'); // Uncomment when dashboard exists
                console.log('Login successful:', response);
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
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
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <h2 className="fw-bold">Welcome Back</h2>
                                    <p className="text-muted">
                                        Sign in to your account to continue
                                    </p>
                                </div>

                                {message.text && (
                                    <Alert variant={message.type} className="animate-fade-in">
                                        {message.text}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-person me-2"></i>
                                            Username
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="Enter your username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            isInvalid={!!errors.username}
                                            className="py-2"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-lock me-2"></i>
                                            Password
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                isInvalid={!!errors.password}
                                                className="py-2"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                            </button>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </div>
                                    </Form.Group>

                                    <div className="text-end mb-3">
                                        <Link to="/forgot-password" className="text-decoration-none small">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <p className="text-muted mb-0">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-decoration-none fw-semibold">
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
