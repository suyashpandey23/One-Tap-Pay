// NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from '../Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        }, 2500);
    }, []);

    return (
        <NotificationContext.Provider value={addNotification}>
            {children}
            <div className="notification-container">
                {notifications.map(notification => (
                    <Notification key={notification.id} type={notification.type} message={notification.message} onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};