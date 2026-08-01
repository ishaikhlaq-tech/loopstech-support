import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [desktopAlertsEnabled, setDesktopAlertsEnabled] = useState(
    window.Notification?.permission === 'granted'
  );
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const data = await apiRequest('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  // Initial fetch and basic polling (every 30s)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  const addNotification = useCallback((notification) => {
    // Optimistic UI update, though typically real-time would use websockets
    setNotifications((prev) => [
      {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);

    if (desktopAlertsEnabled && window.Notification) {
      new window.Notification(notification.title, {
        body: notification.description,
      });
    }
  }, [desktopAlertsEnabled]);

  const requestDesktopAlerts = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }

    const permission = await window.Notification.requestPermission();
    setDesktopAlertsEnabled(permission === 'granted');
  }, []);

  const value = {
    notifications,
    unreadCount,
    desktopAlertsEnabled,
    markAsRead,
    markAllAsRead,
    addNotification,
    requestDesktopAlerts,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

