import '../../styles/buttons.css';

const Avatar = ({ userFirstName, onClick }) => {
    const userFirstNameLetter = userFirstName
        ? userFirstName.charAt(0).toUpperCase()
        : '?';
    return (
        <button
            className="avatar-btn"
            onClick={onClick}
            aria-label="User profile"
        >
            {userFirstNameLetter}
        </button>
    );
};
export default Avatar;
