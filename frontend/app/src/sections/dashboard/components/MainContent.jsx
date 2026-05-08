import GroupCard from './GroupCard';

const MainContent = ({ role, groups }) => {
    return (
        <div className="main-content-container">
            <div className="group-list">
                {groups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
};

export default MainContent;
