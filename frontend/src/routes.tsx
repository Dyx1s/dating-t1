import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import Home from './components/Home/Home';

import { useAuthStore } from './stores/AuthStore';
import { observer } from 'mobx-react-lite';
import Profile from './Profile/Profile';

const AppRoutes = observer(() => {
    const authStore = useAuthStore();

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Register />} />

                <Route path="/home" element={authStore.isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/profile/" element={<Profile />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
});

export default AppRoutes;
