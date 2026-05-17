import { Routes, Route } from 'react-router-dom';
import LoginPage from './sections/auth/pages/LoginPage';
import RegisterPage from './sections/auth/pages/Register';
import DashboardPage from './sections/dashboard/pages/DashBoardPage';
import GroupDashboard from './sections/dashboard/pages/groupDashboard';
import ProtectedRoute from './global/components/protectedRoute';
import NotFound from './global/components/notFound';
import ProtectedLayout from './global/components/protectedLayout';
import { Navigate } from 'react-router-dom';
import CommunityPage from './sections/community/pages/CommunityPage';
import Settings from './sections/settings/components/settings';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                element={
                    <ProtectedRoute>
                        <ProtectedLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                    path="/dashboard/group/:groupId"
                    element={<GroupDashboard />}
                />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
