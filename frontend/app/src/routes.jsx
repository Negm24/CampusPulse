import { Routes, Route } from 'react-router-dom';
import LoginPage from './sections/auth/pages/LoginPage';
import RegisterPage from './sections/auth/pages/Register';
import DashboardPage from './sections/dashboard/pages/DashBoardPage';
import ProtectedRoute from './global/components/protectedRoute';
import NotFound from './global/components/notFound';
import React from 'react';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/not-found" element={<NotFound />} />
        </Routes>
    );
}
