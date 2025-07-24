import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaHome,
    FaChartLine,
    FaUserFriends,
    FaCog,
} from 'react-icons/fa';
import '../styles/header.css';
import LogoutButton from './buttons/logoutButton';

const Header = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/dashboard" className="logo">
                    CampusPulse
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <FaTimes size={24} />
                    ) : (
                        <FaBars size={24} />
                    )}
                </button>

                <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link
                        to="/dashboard"
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaHome /> Dashboard
                    </Link>
                    <Link
                        to="/analytics"
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaChartLine /> Analytics
                    </Link>
                    <Link
                        to="/community"
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaUserFriends /> Community
                    </Link>
                    <Link
                        to="/settings"
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaCog /> Settings
                    </Link>

                    <LogoutButton />
                </nav>
            </div>
        </header>
    );
};

export default Header;
