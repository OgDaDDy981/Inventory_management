'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore, PurchaseItem } from '@/lib/store';
import { Plus, X, Search, Receipt, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

export default function Purchases() {
  const { products, suppliers, purchases, addPurchase } = useInventoryStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ supplierId: '', items: [] as PurchaseItem[], status: 'received' as 'received' | 'pending' | 'cancelled' });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const filtered = useMemo(() =>
    purchases.filter(p => p.supplierName.toLowerCase().includes(search.toLowerCase())),
    [purchases, search]
  );

  const totalSpend = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const pending = purchases.filter(p => p.status === 'pending').length;
  const received = purchases.filter(p => p.status === 'received').length;

  const addItem = () => {
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) { toast.error('Select a product'); return; }
    if (selectedQty <= 0) { toast.error('Quantity must be > 0'); return; }
    const existing = form.items.findIndex(i => i.productId === prod.id);
    if (existing >= 0) {
      setForm(f => ({ ...f, items: f.items.map((i, idx) => idx === existing ? { ...i, quantity: i.quantity + selectedQty } : i) }));
    } else {
      setForm(f => ({ ...f, items: [...f.items, { productId: prod.id, productName: prod.name, quantity: selectedQty, price: selectedPrice || prod.purchasePrice }] }));
    }
    setSelectedProduct(''); setSelectedQty(1); setSelectedPrice(0);
  };

  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const total = form.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === form.supplierId);
    if (!supplier) { toast.error('Select a supplier'); return; }
    if (form.items.length === 0) { toast.error('Add at least one product'); return; }
    addPurchase({ supplierId: form.supplierId, supplierName: supplier.name, items: form.items, totalAmount: total, date: new Date().toISOString(), status: form.status });
    toast.success('Purchase order created!');
    setShowModal(false);
    setForm({ supplierId: '', items: [], status: 'received' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Purchases', value: purchases.length, color: '#3b82f6', suffix: ' orders' },
          { label: 'Total Spent', value: `₹${totalSpend.toLocaleString('en-IN')}`, color: '#8b5cf6' },
          { label: 'Pending Orders', value: pending, color: '#f59e0b', suffix: ' orders' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}{s.suffix || ''}</div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search by supplier..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Plus size={16} /> New Purchase Order
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Supplier</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>#{p.id.slice(0, 8)}</span></td>
                <td style={{ fontWeight: 600 }}>{p.supplierName}</td>
                <td style={{ color: '#94a3b8' }}>{p.items.length} item{p.items.length !== 1 ? 's' : ''}</td>
                <td style={{ fontWeight: 700, color: '#8b5cf6' }}>₹{p.totalAmount.toLocaleString('en-IN')}</td>
                <td><span className={`badge ${p.status === 'received' ? 'badge-green' : p.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>{p.status}</span></td>
                <td style={{ color: '#64748b', fontSize: 13 }}>{format(parseISO(p.date), 'MMM d, yyyy')}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 50, textAlign: 'center', color: '#64748b' }}>
            <Receipt size={48} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            <p>No purchase orders yet</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))', borderRadius: '24px 24px 0 0' }}>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><Receipt size={18} color="#8b5cf6" /> New Purchase Order</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplier</label>
                    <select className="input-field" value={form.supplierId} onChange={e => setForm(f => ({ ...f, supplierId: e.target.value }))}>
                      <option value="">Select supplier...</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                    <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                      <option value="received">Received</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Products</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select className="input-field" style={{ flex: 2 }} value={selectedProduct} onChange={e => { const p = products.find(pr => pr.id === e.target.value); setSelectedProduct(e.target.value); setSelectedPrice(p?.purchasePrice || 0); }}>
                      <option value="">Select product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.purchasePrice})</option>)}
                    </select>
                    <input className="input-field" type="number" min={1} style={{ width: 80 }} placeholder="Qty" value={selectedQty} onChange={e => setSelectedQty(Number(e.target.value))} />
                    <input className="input-field" type="number" min={0} style={{ width: 100 }} placeholder="Price ₹" value={selectedPrice} onChange={e => setSelectedPrice(Number(e.target.value))} />
                    <button type="button" onClick={addItem} className="btn-primary" style={{ flexShrink: 0 }}>Add</button>
                  </div>
                </div>

                {form.items.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {form.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{item.productName}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>₹{item.price.toLocaleString()} × {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#8b5cf6' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        <button type="button" onClick={() => removeItem(idx)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, padding: 6, color: '#ef4444', cursor: 'pointer' }}><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: '#94a3b8' }}>Total:</span>
                      <span style={{ fontWeight: 800, fontSize: 16, color: '#8b5cf6' }}>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Purchase Order</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
