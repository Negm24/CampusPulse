import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAccessToken, logout } from '../../utils/token';
import { useState } from 'react';
// import axios from 'axios';
// import apiUrlManager from '../../utils/apiUrlManager';
import Api from '../../utils/apiAxiosManager';

const ProtectedRoute = ({ children }) => {
    const [token, setToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // const localNetwork = apiUrlManager.getlocalNetworkUrl();

    useEffect(() => {
        const token = getAccessToken();

        if (!token) {
            setToken(false);
            logout(navigate);
        }
        // axios
        //     .get(`${localNetwork}/protected/verify-token`, {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     })
        //     .then((res) => {
        //         if (res.data.valid) {
        //             setToken(true);
        //             setLoading(false); // allow rendering
        //         }
        //     })
        //     .catch((err) => {
        //         console.log('Token expired or invalid');
        //         navigate('/not-found');
        //     });

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

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div>{token ? children : <Navigate to="/not-found" />}</div>
        </>
    );
};

export default ProtectedRoute;
