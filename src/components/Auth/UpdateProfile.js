import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CenteredContainer from './CenteredContainer';
import Login from './Login';

const UpdateProfile = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const nameRef = useRef();
    const { currentUser, updateEmail, updatePassword, updateName, logout } = useAuth();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const history = useHistory();


    function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value)
            return setError('Passwords do not match');

        const promises = []
        setLoading(true);
        setError('');
        setMessage('');
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
            setMessage('To view changes please login again.');
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
            setMessage('To view changes please login again.');
        }

        if (nameRef.current.value !== currentUser.displayName) {
            promises.push(updateName(nameRef.current.value));
            setMessage('To view changes please login again.');
        }

        Promise.all(promises).then(() => {
            logout();
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} required defaultValue={currentUser.displayName} />
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Leave blank if you do not want to update" />
                        </Form.Group>
                        <Form.Group id="passwordConfirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank if you do not want to update" />
                        </Form.Group>
                        {
                            loading ?
                                <Button className="w-100" disabled={loading}>
                                    <Spinner animation="border" variant="light" />
                                </Button>
                                :
                                <Button disabled={loading} type="submit" className="w-100">
                                    Update
                                </Button>
                        }
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/user">Cancel</Link>
            </div>
        </CenteredContainer>
    )
}

export default UpdateProfile
