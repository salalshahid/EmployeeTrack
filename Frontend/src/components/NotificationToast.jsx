import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationToast = ({ notifications }) => {
  useEffect(() => {
    console.log(notifications);
    notifications.forEach((notification) => {
      toast.info(notification.message, {
        position: 'top-center',  // Ensure this is the correct way to access the position
        autoClose: false, // Keep the toast open until the user closes it
      });
    });
  }, [notifications]);

  return <ToastContainer />;
};

export default NotificationToast;