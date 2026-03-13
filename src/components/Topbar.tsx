'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, X, CheckCheck, AlertTriangle, TrendingUp, Package, Zap } from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';

interface TopbarProps {
  currentPage: string;
  sidebarWidth: number;
}

const pageNames: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Product Management',
  inventory: 'Stock Tracking',
  expiry: 'Expiry Manager',
  sales: 'Sales',
  purchases: 'Purchases',
  suppliers: 'Supplier Management',
  analytics: 'Analytics & Insights',
  reports: 'Reports',
};

const notifIcons: Record<string, React.ReactNode> = {
  low_stock: <AlertTriangle size={14} color="#f59e0b" />,
  expiring: <AlertTriangle size={14} color="#ef4444" />,
  expired: <AlertTriangle size={14} color="#ef4444" />,
  large_sale: <TrendingUp size={14} color="#10b981" />,
  info: <Zap size={14} color="#3b82f6" />,
};

export default function Topbar({ currentPage, sidebarWidth }: TopbarProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useInventoryStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, zIndex: 40,
      left: sidebarWidth,
      background: 'rgba(3, 7, 18, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'left 0.3s ease',
    }}>
      {/* Page title */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>
          {pageNames[currentPage] || 'Dashboard'}
        </h1>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            className="input-field"
            style={{ paddingLeft: 36, width: 240 }}
            placeholder="Search products, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 10,
              color: '#94a3b8', cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#ef4444', color: 'white',
                fontSize: 10, fontWeight: 700,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid rgba(3,7,18,0.9)',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, width: 360,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  zIndex: 100, overflow: 'hidden',
                }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Notifications</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{unreadCount} unread</div>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                      <Bell size={32} style={{ margin: '0 auto 8px', opacity: 0.3, display: 'block' }} />
                      No notifications
                    </div>
                  ) : notifications.slice(0, 10).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: notif.read ? 'transparent' : 'rgba(59,130,246,0.04)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ marginTop: 2, flexShrink: 0, background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 8 }}>
                        {notifIcons[notif.type]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: notif.read ? '#64748b' : 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {notif.title}
                          {!notif.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, whiteSpace: 'normal' }}>{notif.message}</div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                          {format(parseISO(notif.date), 'MMM d, h:mm a')}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', flexShrink: 0, padding: 2 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, cursor: 'pointer' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Admin</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
}
