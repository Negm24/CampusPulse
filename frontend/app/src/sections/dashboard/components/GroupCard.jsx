import { FaEllipsisV } from 'react-icons/fa';

const GroupCard = ({ group }) => {
    const firstLetter = group.instructor
        ? group.instructor.charAt(0).toUpperCase()
        : 'G';
    const handleClick = () => {
        alert(`Open ${group.name}`);
    };

    const handleClick2 = () => {
        alert(`Open ${group.subject}`);
    };

    return (
        <div className="group-card">
            <div className="group-card-header" onClick={handleClick}>
                <h2 style={{ margin: '1%' }}>{group.subject}</h2>
                <strong>{group.date}</strong>
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
