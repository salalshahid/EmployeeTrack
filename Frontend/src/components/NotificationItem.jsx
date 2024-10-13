// NotificationItem.js
import React from 'react';

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      <div className="notification-message">{notification.message}</div>
      <div className="notification-date">
        {new Date(notification.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NotificationItem;