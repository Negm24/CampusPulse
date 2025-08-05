import '../styles/dashboard.css';
import LeftSidebar from '../components/LeftSideBar';
import MainContent from '../components/MainContent';

export default function DashboardPage() {
    return (
        <div id="dashboard-page">
            {/* Sidebar */}
            <LeftSidebar />
            {/* Main Content */}
            <div className="main-content">
                <h1 className="page-title">Welcome back, Negm 👋</h1>
                <MainContent />
            </div>
        </div>
    );
}
