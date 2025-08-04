import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../../utils/token';
import { useState } from 'react';
import Api from '../../utils/apiAxiosManager';
import Loading1 from './loading/loading';

const ProtectedRoute = ({ children }) => {
    const [token, setToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAccessToken();

        if (!token) {
            setToken(false);
            logout(navigate);
        }

        Api.get('/protected/verify-token', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((data) => {
                if (data.valid) {
                    setToken(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log('Token expired or invalid');
                navigate('/not-found');
            });
    }, [navigate]);

    if (loading) return <Loading1 />;

    return (
        <>
            <div>{token ? children : <Navigate to="/not-found" />}</div>
        </>
    );
};

export default ProtectedRoute;
