'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore } from '@/lib/store';
import { Plus, TrendingUp, TrendingDown, RotateCcw, AlertOctagon, X, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOVEMENT_TYPES = [
  { value: 'stock_in', label: 'Stock In', icon: TrendingUp, color: '#10b981' },
  { value: 'stock_out', label: 'Stock Out', icon: TrendingDown, color: '#3b82f6' },
  { value: 'return', label: 'Return', icon: RotateCcw, color: '#f59e0b' },
  { value: 'damaged', label: 'Damaged', icon: AlertOctagon, color: '#ef4444' },
];

export default function Inventory() {
  const { products, stockMovements, addStockMovement } = useInventoryStore();
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ productId: '', type: 'stock_in', quantity: 1, note: '' });

  const filtered = useMemo(() => {
    return stockMovements.filter(m => {
      const matchType = typeFilter === 'all' || m.type === typeFilter;
      const matchSearch = m.productName.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [stockMovements, typeFilter, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === form.productId);
    if (!product) { toast.error('Select a product'); return; }
    if (form.quantity <= 0) { toast.error('Quantity must be > 0'); return; }

    addStockMovement({
      productId: form.productId,
      productName: product.name,
      type: form.type as any,
      quantity: Number(form.quantity),
      note: form.note,
      date: new Date().toISOString(),
    });
    toast.success('Stock movement recorded!');
    setShowModal(false);
    setForm({ productId: '', type: 'stock_in', quantity: 1, note: '' });
  };

  // Stock chart data
  const chartData = useMemo(() => {
    return products.slice(0, 8).map(p => ({
      name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
      Stock: p.quantity,
      Threshold: p.minStockThreshold,
    }));
  }, [products]);

  const movementTypeInfo = {
    stock_in: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <TrendingUp size={14} /> },
    stock_out: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: <TrendingDown size={14} /> },
    return: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <RotateCcw size={14} /> },
    damaged: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <AlertOctagon size={14} /> },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {MOVEMENT_TYPES.map(type => {
          const count = stockMovements.filter(m => m.type === type.value).length;
          const total = stockMovements.filter(m => m.type === type.value).reduce((s, m) => s + m.quantity, 0);
          const Icon = type.icon;
          return (
            <motion.div key={type.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}
              style={{ background: `rgba(${type.color === '#10b981' ? '16,185,129' : type.color === '#3b82f6' ? '59,130,246' : type.color === '#f59e0b' ? '245,158,11' : '239,68,68'},0.08)`, border: `1px solid ${type.color}25`, borderRadius: 20, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: `${type.color}20`, borderRadius: 10, padding: 8 }}>
                  <Icon size={18} color={type.color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{type.label}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>{total.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{count} transactions</div>
            </motion.div>
          );
        })}
      </div>

      {/* Stock levels chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>Current Stock Levels</h3>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Stock vs minimum threshold</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="Stock" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Threshold" fill="rgba(245,158,11,0.4)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Filter + Action */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search movements..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ value: 'all', label: 'All' }, ...MOVEMENT_TYPES.map(t => ({ value: t.value, label: t.label }))].map(t => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              style={{ padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: typeFilter === t.value ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)', color: typeFilter === t.value ? 'white' : '#94a3b8', transition: 'all 0.2s' }}
            >{t.label}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Plus size={16} /> Record Movement
        </button>
      </div>

      {/* Movement history table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Note</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const info = movementTypeInfo[m.type];
              return (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                  <td style={{ fontWeight: 600 }}>{m.productName}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: info.bg, color: info.color, padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {info.icon}
                      {MOVEMENT_TYPES.find(t => t.value === m.type)?.label}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: m.type === 'stock_in' || m.type === 'return' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {m.type === 'stock_in' || m.type === 'return' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {m.quantity}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', maxWidth: 200 }}>{m.note || '—'}</td>
                  <td style={{ color: '#64748b', fontSize: 13 }}>{format(parseISO(m.date), 'MMM d, yyyy • h:mm a')}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No movements recorded yet.</div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>Record Stock Movement</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</label>
                  <select className="input-field" value={form.productId} onChange={e => setForm(p => ({ ...p, productId: e.target.value }))}>
                    <option value="">Select product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Movement Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {MOVEMENT_TYPES.map(t => (
                      <button
                        key={t.value} type="button"
                        onClick={() => setForm(p => ({ ...p, type: t.value }))}
                        style={{
                          padding: '10px 14px', borderRadius: 12, border: `1px solid ${form.type === t.value ? t.color : 'rgba(255,255,255,0.08)'}`,
                          background: form.type === t.value ? `${t.color}15` : 'rgba(255,255,255,0.03)',
                          color: form.type === t.value ? t.color : '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: 8
                        }}
                      >
                        <t.icon size={14} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</label>
                  <input className="input-field" type="number" min={1} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Note</label>
                  <input className="input-field" placeholder="Reason or reference..." value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Record Movement</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
