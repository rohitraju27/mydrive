import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CenteredContainer from './CenteredContainer';

const Profile = () => {

    const [error, setError] = useState('');
    const { currentUser, logout } = useAuth();
    const history = useHistory();

    const handleLogout = async () => {
        setError('');
        try {
            await logout();
            history.push('/login');
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <Link to='/' style={{ position: "absolute", right: "20px", top: "15px" }}>Go Back</Link>
            <CenteredContainer>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <strong>Email:</strong> {currentUser.email}
                        <br /><strong>Name:</strong> {currentUser.displayName}
                        <Link to="/update-profile" className="mt-3 btn btn-primary w-100">Update Profile</Link>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Button variant="link" onClick={handleLogout}>Log Out</Button>
                </div>
            </CenteredContainer>
        </>
    )
}

export default Profile
