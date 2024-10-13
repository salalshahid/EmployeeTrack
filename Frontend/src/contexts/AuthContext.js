import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import NotificationToast from '../components/NotificationToast';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // State initialization
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminOrManager, setIAdminOrManager] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    useEffect(() => {
        // Initial check
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (accessToken && storedUser) {
            setIsLoggedIn(true);
            setIsAdmin(storedUser.role === 'administrator');
            setIAdminOrManager(storedUser.role === 'administrator' || storedUser.role === 'manager');
            setUnreadNotificationsCount(storedUser.unread_notifications);
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user)); // Store the whole user object
        setIsLoggedIn(true);
        setIsAdmin(user.role === 'administrator');
        setIAdminOrManager(user.role === 'administrator' || user.role === 'manager');
        setUnreadNotificationsCount(user.unread_notifications);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isAdminOrManager');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIAdminOrManager(false);
    };

    const value = useMemo(() => ({
        isLoggedIn,
        isAdmin,
        isAdminOrManager,
        login,
        logout
    }), [isLoggedIn, isAdmin, isAdminOrManager]);

    return (
        <AuthContext.Provider value={value}>
            {unreadNotificationsCount > 0 && (
                <NotificationToast notifications={[`You have ${unreadNotificationsCount} unread notification(s).`]} />
            )}
            {children}
        </AuthContext.Provider>
    );
};