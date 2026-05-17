import '../styles/dashboard.css';
import MainContent from '../components/MainContent';
import { useOutletContext } from 'react-router-dom';
import AddJoinGroupButton from '../components/AddJoinGroupButton';

export default function DashboardPage() {
    const { user, groups } = useOutletContext();

    if (user.role !== 'admin') {
        return (
            <div id="dashboard-page">
                <div className="main-content">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '2rem',
                        }}
                    >
                        <h1 className="page-title" style={{ margin: 0 }}>
                            Welcome back, {user?.first_name || 'User'}
                        </h1>
                        <div className="AddJoinGroup-btn-container">
                            <AddJoinGroupButton user={user} />
                        </div>
                    </div>
                    <MainContent role={user.role} groups={groups} />
                </div>
            </div>
        );
    } else {
        return (
            <div id="dashboard-page">
                <div className="main-content">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '2rem',
                        }}
                    >
                        <h1 className="page-title" style={{ margin: 0 }}>
                            Welcome back, {user?.first_name || 'Admin'} 👋
                            [ADMIN]
                        </h1>
                    </div>
                    <MainContent role={user.role} groups={[]} />
                </div>
            </div>
        );
    }
}
