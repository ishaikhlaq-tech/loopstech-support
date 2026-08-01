import { useEffect, useRef, useState } from 'react';
import { Bell, Check, Clock, X, ChevronRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationPanel.css';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

const getBadgeStyles = (type) => {
  switch (type) {
    case 'SLA_BREACH':
      return { bg: '#EAF5F3', text: '#0F766E', border: '#A7D9D3' }; // Matches the teal SLA BREACH in screenshot
    case 'SLA_WARNING':
      return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
    case 'NEW_TICKET':
    case 'NEW_COMMENT':
      return { bg: '#EFF6FF', text: '#3B82F6', border: '#BFDBFE' };
    case 'TICKET_ASSIGNED':
    case 'TICKET_REASSIGNED':
      return { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF' };
    case 'TICKET_ESCALATED':
      return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
    default:
      return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
  }
};

const NotificationCard = ({ notification }) => {
  const { markAsRead } = useNotifications();
  const badgeStyles = getBadgeStyles(notification.type);

  return (
    <div className={`notif-card ${!notification.read ? 'notif-unread' : 'notif-read'}`}>
      <div className="notif-indicator-col">
        {!notification.read && <div className="notif-unread-dot"></div>}
      </div>
      
      <div className="notif-content">
        <div className="notif-meta">
          <span 
            className="notif-badge"
            style={{ 
              backgroundColor: badgeStyles.bg, 
              color: badgeStyles.text,
              borderColor: badgeStyles.border
            }}
          >
            {notification.type.replace('_', ' ')}
          </span>
          <span className="notif-time">{formatTimeAgo(notification.createdAt)}</span>
        </div>
        
        <h4 className="notif-title">{notification.title}</h4>
        <p className="notif-desc">{notification.description}</p>
        
        <button className="notif-view-btn">View Ticket</button>
      </div>

      <div className="notif-action-col">
        {!notification.read && (
          <button 
            className="notif-check-btn" 
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            aria-label="Mark as read"
          >
            <Check className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};

const NotificationPanel = ({ onClose }) => {
  const { 
    notifications, 
    markAllAsRead, 
    desktopAlertsEnabled, 
    requestDesktopAlerts 
  } = useNotifications();
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking the toggle button itself (handled by TopNavbar)
      if (event.target.closest('.notif-toggle-btn')) return;
      
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="notif-panel-wrapper" ref={panelRef}>
      <div className="notif-header">
        <h3 className="notif-header-title">Notifications</h3>
        <button className="notif-mark-all" onClick={markAllAsRead}>
          MARK ALL READ
        </button>
      </div>

      <div className="notif-desktop-alerts">
        <div className="notif-alerts-left">
          <Bell className="w-4 h-4 text-[#0F766E]" strokeWidth={2} />
          <span className="notif-alerts-text">Desktop alerts</span>
        </div>
        {desktopAlertsEnabled ? (
          <span className="notif-alerts-enabled">Desktop alerts enabled</span>
        ) : (
          <button className="notif-alerts-enable-btn" onClick={requestDesktopAlerts}>
            Enable
          </button>
        )}
      </div>

      <div className="notif-list-container">
        {notifications.length === 0 ? (
          <div className="notif-empty-state">
            <Bell className="w-7 h-7 text-[#94A3B8] mb-3" strokeWidth={1.5} />
            <h4 className="text-[12px] font-bold text-[#0F172A] mb-1">You're all caught up!</h4>
            <p className="text-[11px] text-[#64748B]">No new notifications.</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
