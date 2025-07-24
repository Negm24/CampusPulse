import { Routes, Route } from 'react-router-dom';
import LoginPage from './sections/auth/pages/LoginPage';
import RegisterPage from './sections/auth/pages/Register';
import DashboardPage from './sections/dashboard/pages/DashBoardPage';
import ProtectedRoute from './global/components/protectedRoute';
import NotFound from './global/components/notFound';
import ProtectedLayout from './global/components/protectedLayout';

export default function AppRoutes() {
    return (
        <Routes>
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
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
