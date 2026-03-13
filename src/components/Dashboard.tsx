'use client';

import { motion, Variants } from 'framer-motion';
import { useInventoryStore } from '@/lib/store';
import { useMemo } from 'react';
import {
  Package, TrendingUp, AlertTriangle, Calendar,
  DollarSign, ShoppingCart, Award, ArrowUp, ArrowDown,
  Activity, BarChart2, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
    </motion.span>
  );
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#f97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.name === 'Revenue' || p.name === 'Profit' ? '₹' : ''}{p.value?.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { products, sales, stockMovements, notifications } = useInventoryStore();

  const stats = useMemo(() => {
    const today = new Date();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = products.filter(p => p.quantity <= p.minStockThreshold).length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

    const expiringProducts = products.filter(p => {
      if (!p.expiryDate) return false;
      const exp = new Date(p.expiryDate);
      const diff = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    }).length;

    return { totalProducts, totalStock, lowStock, expiringProducts, totalRevenue, totalProfit };
  }, [products, sales]);

  // Revenue last 7 days
  const revenueData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySales = sales.filter(s => s.date.startsWith(dateStr));
      return {
        day: format(date, 'EEE'),
        Revenue: daySales.reduce((sum, s) => sum + s.totalAmount, 0),
        Profit: daySales.reduce((sum, s) => sum + s.profit, 0),
      };
    });
  }, [sales]);

  // Category distribution
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Top products by profit margin
  const topProducts = useMemo(() => {
    return [...products]
      .map(p => ({ ...p, margin: ((p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100) }))
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5);
  }, [products]);

  // Low stock products
  const lowStockProducts = useMemo(() =>
    products.filter(p => p.quantity <= p.minStockThreshold).slice(0, 5),
    [products]
  );

  // Recent activity
  const recentActivity = useMemo(() =>
    [...stockMovements].slice(0, 6),
    [stockMovements]
  );

  const statCards = [
    {
      label: 'Total Products', value: stats.totalProducts, icon: Package,
      gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))',
      iconBg: 'rgba(59,130,246,0.2)', iconColor: '#3b82f6',
      change: '+3 this week', up: true
    },
    {
      label: 'Total Stock', value: stats.totalStock, icon: BarChart2,
      gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))',
      iconBg: 'rgba(139,92,246,0.2)', iconColor: '#8b5cf6',
      change: '+120 units added', up: true
    },
    {
      label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle,
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
      iconBg: 'rgba(245,158,11,0.2)', iconColor: '#f59e0b',
      change: 'Needs restocking', up: false
    },
    {
      label: 'Expiring Soon', value: stats.expiringProducts, icon: Calendar,
      gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
      iconBg: 'rgba(239,68,68,0.2)', iconColor: '#ef4444',
      change: 'Within 30 days', up: false
    },
    {
      label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign,
      gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
      iconBg: 'rgba(16,185,129,0.2)', iconColor: '#10b981',
      prefix: '₹', change: '+12% vs last month', up: true
    },
    {
      label: 'Total Profit', value: stats.totalProfit, icon: TrendingUp,
      gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
      iconBg: 'rgba(6,182,212,0.2)', iconColor: '#06b6d4',
      prefix: '₹', change: '+8% vs last month', up: true
    },
  ];

  const movementColors: Record<string, string> = {
    stock_in: '#10b981', stock_out: '#3b82f6', return: '#f59e0b', damaged: '#ef4444'
  };
  const movementLabels: Record<string, string> = {
    stock_in: 'Stock In', stock_out: 'Stock Out', return: 'Return', damaged: 'Damaged'
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome banner */}
      <motion.div variants={fadeUp} style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 20, padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Admin! 👋
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
            Here&apos;s what&apos;s happening with your inventory today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>{sales.length}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Total Sales</div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>{stockMovements.length}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Movements</div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: card.gradient,
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '20px 22px',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ background: card.iconBg, borderRadius: 12, padding: 10 }}>
                  <Icon size={20} color={card.iconColor} />
                </div>
                <span style={{ fontSize: 11, color: card.up ? '#10b981' : '#f59e0b', background: card.up ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', padding: '3px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {card.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {card.up ? '↑' : '↓'}
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>
                {card.prefix || ''}<AnimatedNumber value={card.value} />
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{card.change}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Revenue Chart */}
        <motion.div variants={fadeUp} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>Revenue & Profit</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Last 7 days</p>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: 10, padding: '6px 12px', fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>
              Live
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="Profit" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#profGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div variants={fadeUp} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: 'white', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>Category Split</h3>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Products by category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any, n: any) => [v, n]} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {categoryData.map((cat, i) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{cat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Top Products */}
        <motion.div variants={fadeUp} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Award size={18} color="#f59e0b" />
            <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Top Margin Products</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: i === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: i === 0 ? '#f59e0b' : '#64748b', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{p.category}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{p.margin.toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div variants={fadeUp} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Low Stock Alerts</h3>
          </div>
          {lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: 14 }}>
              ✅ All products well-stocked
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lowStockProducts.map(p => {
                const pct = Math.max(5, (p.quantity / p.minStockThreshold) * 100);
                return (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{p.name}</span>
                      <span style={{ fontSize: 12, color: p.quantity === 0 ? '#ef4444' : '#f59e0b', fontWeight: 600, flexShrink: 0 }}>
                        {p.quantity} left
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(100, pct)}%`, background: pct < 30 ? '#ef4444' : '#f59e0b' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={18} color="#3b82f6" />
            <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Recent Activity</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((act, i) => (
              <div key={act.id} style={{ display: 'flex', gap: 12, paddingBottom: i < recentActivity.length - 1 ? 12 : 0, position: 'relative' }}>
                {i < recentActivity.length - 1 && (
                  <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 1, background: 'rgba(255,255,255,0.06)' }} />
                )}
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `rgba(${movementColors[act.type] === '#10b981' ? '16,185,129' : movementColors[act.type] === '#3b82f6' ? '59,130,246' : movementColors[act.type] === '#f59e0b' ? '245,158,11' : '239,68,68'},0.15)`, border: `1px solid ${movementColors[act.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <Zap size={10} color={movementColors[act.type]} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>{act.productName}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                    <span style={{ color: movementColors[act.type] }}>{movementLabels[act.type]}</span> · {act.quantity} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
