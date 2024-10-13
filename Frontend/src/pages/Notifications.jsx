import React, { useState, useEffect } from 'react';
import NotificationItem from '../components/NotificationItem';
import { fetchNotifications } from '../api/notifications';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (err) {
                setError('Failed to fetch notifications.');
                console.error(err);
            }
        };

        getNotifications();
    }, []);

    return (
        <div className="container">
            <h2>Notifications</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="notifications-list">
                {notifications.map(notification => (
                    <NotificationItem key={notification._id} notification={notification} />
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;