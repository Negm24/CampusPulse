import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/token';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
