import GroupCard from './GroupCard';

const mockGroups = [
    {
        id: 1,
        name: 'CS101',
        subject: 'Data analytics and Optimization using python',
        instructor: 'Dr. A',
        date: 'Wednesday',
    },
    {
        id: 2,
        name: 'Math101',
        subject: 'Mathematics',
        instructor: 'Prof. B',
        date: 'Thursday',
    },
    {
        id: 3,
        name: 'Bio101',
        instructor: 'Prof.C',
        subject: 'Biology',
        date: 'Friday',
    },
    {
        id: 4,
        name: 'Chem101',
        subject: 'Chemistry',
        instructor: 'Dr. D',
        date: 'Monday',
    },
];

const MainContent = () => {
    return (
        <div className="main-content-container">
            <div className="group-list">
                {mockGroups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
};

export default MainContent;
