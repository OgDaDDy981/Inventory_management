'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInventoryStore } from '@/lib/store';
import { AlertTriangle, CheckCircle, Clock, Package, Calendar } from 'lucide-react';

type ExpiryStatus = 'expired' | 'critical' | 'warning' | 'safe';

function getExpiryStatus(expiryDate: string): { status: ExpiryStatus; days: number } {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { status: 'expired', days };
  if (days <= 7) return { status: 'critical', days };
  if (days <= 30) return { status: 'warning', days };
  return { status: 'safe', days };
}

const statusConfig = {
  expired: { label: 'Expired', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', badgeClass: 'badge-red', icon: AlertTriangle },
  critical: { label: 'Critical (<7 days)', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', badgeClass: 'badge-red', icon: AlertTriangle },
  warning: { label: 'Expiring Soon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', badgeClass: 'badge-yellow', icon: Clock },
  safe: { label: 'Safe', color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', badgeClass: 'badge-green', icon: CheckCircle },
};

export default function ExpiryManager() {
  const { products } = useInventoryStore();

  const { withExpiry, expired, critical, warning, safe } = useMemo(() => {
    const withExpiry = products.filter(p => p.expiryDate).map(p => ({
      ...p,
      ...getExpiryStatus(p.expiryDate!),
    })).sort((a, b) => a.days - b.days);
    return {
      withExpiry,
      expired: withExpiry.filter(p => p.status === 'expired'),
      critical: withExpiry.filter(p => p.status === 'critical'),
      warning: withExpiry.filter(p => p.status === 'warning'),
      safe: withExpiry.filter(p => p.status === 'safe'),
    };
  }, [products]);

  const sections: [string, typeof expired, ExpiryStatus][] = [
    ['Expired Products', expired, 'expired'],
    ['Critical — Expiring within 7 days', critical, 'critical'],
    ['Expiring Soon — Within 30 days', warning, 'warning'],
    ['Safe — More than 30 days', safe, 'safe'],
  ];

  const summaryCards = [
    { label: 'Expired', count: expired.length, config: statusConfig.expired },
    { label: 'Critical (<7d)', count: critical.length, config: statusConfig.critical },
    { label: 'Warning (≤30d)', count: warning.length, config: statusConfig.warning },
    { label: 'Safe', count: safe.length, config: statusConfig.safe },
  ];

  if (withExpiry.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#64748b', gap: 12 }}>
        <Package size={64} style={{ opacity: 0.3 }} />
        <p style={{ fontSize: 18, fontWeight: 600 }}>No products with expiry dates</p>
        <p style={{ fontSize: 14 }}>Add expiry dates to products to track them here</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {summaryCards.map(({ label, count, config }) => {
          const Icon = config.icon;
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              style={{ background: config.bg, border: `1px solid ${config.border}`, borderRadius: 20, padding: '20px 22px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: `${config.color}20`, borderRadius: 10, padding: 8 }}>
                  <Icon size={18} color={config.color} />
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: count > 0 && label !== 'Safe' ? config.color : 'white', fontFamily: 'Space Grotesk' }}>{count}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline view */}
      {sections.map(([title, items, status]) => {
        if (items.length === 0) return null;
        const cfg = statusConfig[status];
        const Icon = cfg.icon;
        return (
          <motion.div key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24, borderLeft: `3px solid ${cfg.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Icon size={18} color={cfg.color} />
              <h3 style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>{title}</h3>
              <span style={{ background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 99, border: `1px solid ${cfg.border}` }}>
                {items.length} product{items.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {items.map(p => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 16, padding: '16px 18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{p.sku} · {p.category}</div>
                    </div>
                    <span className={`badge ${cfg.badgeClass}`} style={{ flexShrink: 0 }}>
                      {p.days < 0 ? `${Math.abs(p.days)}d ago` : p.days === 0 ? 'Today' : `${p.days}d`}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                      Expiry: <strong style={{ color: '#94a3b8' }}>{p.expiryDate}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Stock: <strong style={{ color: '#94a3b8' }}>{p.quantity} units</strong>
                    </div>
                  </div>

                  {/* Urgency bar */}
                  <div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: p.days < 0 ? '100%' : `${Math.min(100, (1 - p.days / 365) * 100)}%`,
                          background: p.days < 0 ? '#ef4444' : p.days <= 7 ? '#f97316' : p.days <= 30 ? '#f59e0b' : '#10b981',
                          transition: 'width 1s ease',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                      {p.days < 0 ? `Expired ${Math.abs(p.days)} days ago` :
                        p.days === 0 ? 'Expires today!' :
                          `${p.days} days until expiry`}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
