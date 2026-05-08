import { FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group }) => {
    const firstLetter = group.instructor
        ? group.instructor.charAt(0).toUpperCase()
        : 'G';

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/dashboard/group/${group.id}`);
    };

    const handleClick2 = () => {
        alert(`Open ${group.subject_code} settings`);
    };

    return (
        <div className="group-card">
            <div className="group-card-header" onClick={handleClick}>
                <h2 style={{ margin: '1%' }}>{group.subject_name}</h2>
                <strong>{group.day}</strong>
                <p>{group.instructor}</p>
            </div>
            <div className="group-card-avatar">
                <span>{firstLetter}</span>
            </div>
            <div className="group-card-body">
                <button
                    onClick={handleClick2}
                    className="group-card-body-button"
                >
                    <FaEllipsisV />
                </button>
            </div>
        </div>
    );
};

export default GroupCard;
