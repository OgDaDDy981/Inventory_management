'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInventoryStore } from '@/lib/store';
import { TrendingUp, Award, AlertTriangle, Target, DollarSign, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#f97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600, fontSize: 13 }}>
            {p.name}: {p.name.includes('₹') || p.name === 'Revenue' || p.name === 'Profit' ? '₹' : ''}
            {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
            {p.name === 'Margin' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { products, sales } = useInventoryStore();

  const productProfitData = useMemo(() =>
    [...products]
      .map(p => ({
        name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
        Margin: parseFloat(((p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100).toFixed(1)),
        'Profit/Unit': p.sellingPrice - p.purchasePrice,
        Stock: p.quantity,
      }))
      .sort((a, b) => b.Margin - a.Margin)
      .slice(0, 8),
    [products]
  );

  const categoryProfit = useMemo(() => {
    const map: Record<string, { revenue: number; profit: number; count: number }> = {};
    products.forEach(p => {
      if (!map[p.category]) map[p.category] = { revenue: 0, profit: 0, count: 0 };
      map[p.category].revenue += p.sellingPrice * p.quantity;
      map[p.category].profit += (p.sellingPrice - p.purchasePrice) * p.quantity;
      map[p.category].count += 1;
    });
    return Object.entries(map).map(([name, v]) => ({ name, Revenue: v.revenue, Profit: v.profit, Products: v.count }));
  }, [products]);

  const slowMoving = useMemo(() =>
    [...products]
      .filter(p => p.quantity > p.minStockThreshold * 3)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5),
    [products]
  );

  const deadStock = useMemo(() =>
    products.filter(p => p.quantity === 0),
    [products]
  );

  const totalInventoryValue = products.reduce((s, p) => s + p.purchasePrice * p.quantity, 0);
  const totalRetailValue = products.reduce((s, p) => s + p.sellingPrice * p.quantity, 0);
  const potentialProfit = totalRetailValue - totalInventoryValue;
  const avgMargin = products.length > 0
    ? (products.reduce((s, p) => s + (p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100, 0) / products.length).toFixed(1)
    : '0';

  const insightCards = [
    { label: 'Inventory Value', value: `₹${totalInventoryValue.toLocaleString('en-IN')}`, sub: 'At purchase price', color: '#3b82f6', icon: DollarSign },
    { label: 'Retail Value', value: `₹${totalRetailValue.toLocaleString('en-IN')}`, sub: 'At selling price', color: '#10b981', icon: TrendingUp },
    { label: 'Potential Profit', value: `₹${potentialProfit.toLocaleString('en-IN')}`, sub: 'If all stock sold', color: '#8b5cf6', icon: Target },
    { label: 'Avg. Margin', value: `${avgMargin}%`, sub: 'Across all products', color: '#f59e0b', icon: BarChart2 },
    { label: 'Slow Moving', value: slowMoving.length, sub: 'Overstocked items', color: '#f97316', icon: AlertTriangle },
    { label: 'Dead Stock', value: deadStock.length, sub: 'Out of stock items', color: '#ef4444', icon: AlertTriangle },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {insightCards.map(card => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}
              style={{ background: `rgba(${card.color === '#3b82f6' ? '59,130,246' : card.color === '#10b981' ? '16,185,129' : card.color === '#8b5cf6' ? '139,92,246' : card.color === '#f59e0b' ? '245,158,11' : card.color === '#f97316' ? '249,115,22' : '239,68,68'},0.1)`, border: `1px solid ${card.color}25`, borderRadius: 18, padding: '18px 20px' }}>
              <Icon size={20} color={card.color} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk' }}>{card.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, fontWeight: 600 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{card.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Product margins */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 4 }}>Product Profit Margins</h3>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Top 8 products by margin %</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productProfitData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Margin" fill="url(#marginGrad)" radius={[0, 6, 6, 0]}>
                {productProfitData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category revenue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 4 }}>Category Performance</h3>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Revenue & profit by category</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryProfit}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Slow moving */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} color="#f97316" />
            <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Slow Moving Inventory</h3>
          </div>
          {slowMoving.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>✅ No overstocked items!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {slowMoving.map(p => {
                const excess = p.quantity - p.minStockThreshold;
                const excessValue = excess * p.purchasePrice;
                return (
                  <div key={p.id} style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{p.category}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#f97316' }}>{p.quantity} units</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Min: {p.minStockThreshold}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      Excess: <strong style={{ color: '#f97316' }}>{excess} units</strong> · Value locked: <strong style={{ color: '#ef4444' }}>₹{excessValue.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Top profitable */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Award size={16} color="#f59e0b" />
            <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Most Profitable Products</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...products].sort((a, b) => (b.sellingPrice - b.purchasePrice) - (a.sellingPrice - a.purchasePrice)).slice(0, 6).map((p, i) => {
              const profit = p.sellingPrice - p.purchasePrice;
              const margin = (profit / p.sellingPrice * 100).toFixed(1);
              const totalProfit = profit * p.quantity;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: i < 3 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', color: i < 3 ? '#f59e0b' : '#64748b', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>₹{profit.toLocaleString()} profit/unit</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{margin}%</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>₹{totalProfit.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
