import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBell } from 'react-icons/fa';  // Import FontAwesome icon

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    const [notificationsCount, setNotificationsCount] = useState(0);
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Function to handle navigation
    const handleNavigate = (link) => {
        navigate(link);
    };

    useEffect(() => {
        setNotificationsCount(storedUser.unread_notifications);
    }, []);

    return (
        isLoggedIn && (
            <div className="navbar-container">
                <div className="navbar bg-body">
                    <img
                        src={storedUser.profile_picture  || '/images/avatar.jpg'}
                        alt="Avatar"
                        className="avatar-img"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                    <div className="user-info bg-body">
                        <div className="user-name">{storedUser.full_name}</div>
                        <div className="user-email">{storedUser.email}</div>
                    </div>
                    <div className="notification-bell bg-body" onClick={() => {
                        setNotificationsCount(0);
                        handleNavigate('/notifications');
                    }}>
                        <FaBell />
                        {notificationsCount > 0 && (
                            <span className="notification-count">
                                {notificationsCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default Navbar;