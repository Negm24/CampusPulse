import { useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/token';
import '../../styles/buttons.css';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    };

    return (
        <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
        </button>
    );
};

export default LogoutButton;
