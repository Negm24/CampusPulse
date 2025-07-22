import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../../utils/token';
import LogoutButton from './buttons/logoutButton';
import { useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const token = getAccessToken();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAccessToken();

        if (!token) {
            logout(navigate);
        }
        axios
            .get('http://localhost:5000/protected/verify-token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.data.valid) {
                    setLoading(false); // allow rendering
                }
            })
            .catch((err) => {
                console.log('Token expired or invalid');
                navigate('/not-found');
            });
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div>{token ? children : <Navigate to="/not-found" />}</div>
            <div>
                <LogoutButton />
            </div>
        </>
    );
};

export default ProtectedRoute;
