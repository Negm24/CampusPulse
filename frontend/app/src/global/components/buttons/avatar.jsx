import '../../styles/buttons.css';
import { Link } from 'react-router-dom';

const Avatar = ({ userFirstName, onClick }) => {
    const userFirstNameLetter = userFirstName
        ? userFirstName.charAt(0).toUpperCase()
        : '?';
    return (
        <Link to="/settings" style={{ textDecoration: 'none' }}>
            <button
                className="avatar-btn"
                onClick={onClick}
                aria-label="User profile"
            >
                {userFirstNameLetter}
            </button>
        </Link>
    );
};
export default Avatar;
