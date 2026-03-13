'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, TrendingUp, ShoppingCart, 
  Truck, BarChart3, Bell, Settings, ChevronRight,
  Boxes, AlertTriangle, Users, Receipt, X, Menu
} from 'lucide-react';
import { useInventoryStore } from '@/lib/store';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
  { id: 'products', label: 'Products', icon: Package, group: 'Inventory' },
  { id: 'inventory', label: 'Stock Tracking', icon: Boxes, group: 'Inventory' },
  { id: 'expiry', label: 'Expiry Manager', icon: AlertTriangle, group: 'Inventory' },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, group: 'Operations' },
  { id: 'purchases', label: 'Purchases', icon: Receipt, group: 'Operations' },
  { id: 'suppliers', label: 'Suppliers', icon: Truck, group: 'Operations' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Reports' },
  { id: 'reports', label: 'Reports', icon: TrendingUp, group: 'Reports' },
];

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { notifications } = useInventoryStore();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [collapsed, setCollapsed] = useState(false);

  const groups = ['Main', 'Inventory', 'Operations', 'Reports'];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        background: 'rgba(7, 11, 22, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
                flexShrink: 0
              }}>
                <Boxes size={20} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'white' }}>StockSense</div>
                <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', fontWeight: 500 }}>PRO PLATFORM</div>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
            }}>
              <Boxes size={20} color="white" />
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: 8, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
        {groups.map(group => {
          const items = navItems.filter(i => i.group === group);
          return (
            <div key={group} style={{ marginBottom: 8 }}>
              {!collapsed && (
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(148,163,184,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>
                  {group}
                </div>
              )}
              {collapsed && <div style={{ height: 4 }} />}
              {items.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    style={{ width: '100%', border: 'none', background: 'none', justifyContent: collapsed ? 'center' : 'flex-start' }}
                    title={collapsed ? item.label : undefined}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <Icon size={18} />
                      {item.id === 'dashboard' && unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid #070b16' }} />
                      )}
                    </div>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, textAlign: 'left' }}>
                        {item.label}
                      </motion.span>
                    )}
                    {!collapsed && isActive && <ChevronRight size={14} />}
                  </motion.button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 12, padding: '12px 14px'
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 4 }}>Pro Plan Active</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Unlimited products & analytics</div>
            <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: 99 }} />
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
