import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CenteredContainer from './CenteredContainer';

const ForgotPassword = () => {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Check your mail for password reset link');
        } catch (error) {
            setError(error.message)
        }

        setLoading(false);

    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        {
                            loading ?
                                <Button disabled={loading} className="w-100">
                                    <Spinner animation="border" variant="light" />
                                </Button>
                                :
                                <Button disabled={loading} type="submit" className="w-100">
                                    Reset Password
                                </Button>
                        }
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Log In</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to='/signup'>Sign Up</Link>
            </div>
        </CenteredContainer>
    )
}

export default ForgotPassword
