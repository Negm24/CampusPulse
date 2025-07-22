import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import '../styles/notfound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="nf-card-container">
                <div className="nf-icon floating">
                    <FaExclamationTriangle />
                </div>

                <h1 className="nf-title">404 - Page Not Found</h1>
                <p className="nf-subtitle">
                    Oops! The page you're looking for doesn't exist or you don't
                    have access.
                </p>

                <div className="nf-actions">
                    <button
                        className="nf-button nf-button-primary"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                    <button
                        className="nf-button nf-button-secondary"
                        onClick={() => navigate('/login')}
                    >
                        <FaUserPlus /> Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
