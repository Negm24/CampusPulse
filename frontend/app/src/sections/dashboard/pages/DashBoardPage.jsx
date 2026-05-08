import '../styles/dashboard.css';
// import LeftSidebar from '../components/LeftSideBar';
import MainContent from '../components/MainContent';
import { useOutletContext } from 'react-router-dom';

export default function DashboardPage() {
    const { user, groups } = useOutletContext();

    if (user.role !== 'admin') {
        return (
            <div id="dashboard-page">
                <div className="main-content">
                    <h1 className="page-title">
                        Welcome back, {user?.first_name || 'User'} 👋
                    </h1>
                    <MainContent role={user.role} groups={groups} />
                </div>
            </div>
        );
    } else {
        return (
            <div id="dashboard-page">
                <div className="main-content">
                    <h1 className="page-title">
                        Welcome back, {user?.first_name || 'Admin'} 👋 [ADMIN]
                    </h1>
                    <MainContent role={user.role} groups={[]} />
                </div>
            </div>
        );
    }
}
