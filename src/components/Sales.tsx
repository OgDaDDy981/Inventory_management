'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore, SaleItem } from '@/lib/store';
import { Plus, X, Search, ShoppingCart, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

export default function Sales() {
  const { products, sales, addSale } = useInventoryStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ customerName: '', items: [] as SaleItem[], tax: 18, discount: 0 });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  const filtered = useMemo(() =>
    sales.filter(s => s.customerName.toLowerCase().includes(search.toLowerCase())),
    [sales, search]
  );

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((s, i) => s + (i.price * i.quantity - i.discount), 0);
    const taxAmt = (subtotal * form.tax) / 100;
    const total = subtotal + taxAmt - form.discount;
    const profit = form.items.reduce((s, i) => {
      const prod = products.find(p => p.id === i.productId);
      return s + ((i.price - (prod?.purchasePrice || 0)) * i.quantity - i.discount);
    }, 0);
    return { subtotal, taxAmt, total, profit };
  }, [form.items, form.tax, form.discount, products]);

  const addItem = () => {
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) { toast.error('Select a product'); return; }
    if (selectedQty > prod.quantity) { toast.error(`Only ${prod.quantity} in stock`); return; }
    const existing = form.items.findIndex(i => i.productId === prod.id);
    if (existing >= 0) {
      setForm(f => ({ ...f, items: f.items.map((i, idx) => idx === existing ? { ...i, quantity: i.quantity + selectedQty } : i) }));
    } else {
      setForm(f => ({ ...f, items: [...f.items, { productId: prod.id, productName: prod.name, quantity: selectedQty, price: prod.sellingPrice, discount: 0 }] }));
    }
    setSelectedProduct(''); setSelectedQty(1);
  };

  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName) { toast.error('Enter customer name'); return; }
    if (form.items.length === 0) { toast.error('Add at least one product'); return; }
    addSale({ ...form, totalAmount: totals.total, profit: totals.profit, date: new Date().toISOString(), status: 'completed' });
    toast.success('Sale recorded successfully!');
    setShowModal(false);
    setForm({ customerName: '', items: [], tax: 18, discount: 0 });
  };

  const totalRevenue = sales.reduce((s, sale) => s + sale.totalAmount, 0);
  const totalProfit = sales.reduce((s, sale) => s + sale.profit, 0);
  const completedSales = sales.filter(s => s.status === 'completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Sales', value: completedSales, color: '#3b82f6', suffix: ' orders' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#10b981' },
          { label: 'Total Profit', value: `₹${totalProfit.toLocaleString('en-IN')}`, color: '#8b5cf6' },
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
          <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search by customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Plus size={16} /> New Sale
        </button>
      </div>

      {/* Sales table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Tax</th>
              <th>Total Amount</th>
              <th>Profit</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sale => (
              <motion.tr key={sale.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>#{sale.id.slice(0, 8)}</span></td>
                <td style={{ fontWeight: 600 }}>{sale.customerName}</td>
                <td style={{ color: '#94a3b8' }}>{sale.items.length} item{sale.items.length !== 1 ? 's' : ''}</td>
                <td style={{ color: '#64748b' }}>{sale.tax}%</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>₹{sale.totalAmount.toLocaleString('en-IN')}</td>
                <td style={{ fontWeight: 700, color: '#8b5cf6' }}>₹{sale.profit.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${sale.status === 'completed' ? 'badge-green' : sale.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                    {sale.status}
                  </span>
                </td>
                <td style={{ color: '#64748b', fontSize: 13 }}>{format(parseISO(sale.date), 'MMM d, yyyy')}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 50, textAlign: 'center', color: '#64748b' }}>
            <ShoppingCart size={48} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            <p>No sales recorded yet</p>
          </div>
        )}
      </div>

      {/* New Sale Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))', borderRadius: '24px 24px 0 0' }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: 18, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><ShoppingCart size={18} color="#10b981" /> Create New Sale</h2>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Add products and customer details</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Name</label>
                  <input className="input-field" placeholder="Customer name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} />
                </div>

                {/* Add items */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Products</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select className="input-field" style={{ flex: 2 }} value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                      <option value="">Select product...</option>
                      {products.filter(p => p.quantity > 0).map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ₹{p.sellingPrice.toLocaleString()} (Stock: {p.quantity})</option>
                      ))}
                    </select>
                    <input className="input-field" type="number" min={1} style={{ width: 80 }} value={selectedQty} onChange={e => setSelectedQty(Number(e.target.value))} />
                    <button type="button" onClick={addItem} className="btn-primary" style={{ flexShrink: 0 }}>Add</button>
                  </div>
                </div>

                {/* Item list */}
                {form.items.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {form.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{item.productName}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>₹{item.price.toLocaleString()} × {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#10b981' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        <button type="button" onClick={() => removeItem(idx)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, padding: 6, color: '#ef4444', cursor: 'pointer' }}><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tax (%)</label>
                    <input className="input-field" type="number" min={0} max={100} value={form.tax} onChange={e => setForm(f => ({ ...f, tax: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Discount (₹)</label>
                    <input className="input-field" type="number" min={0} value={form.discount} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))} />
                  </div>
                </div>

                {/* Totals */}
                {form.items.length > 0 && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Subtotal', value: totals.subtotal },
                      { label: `Tax (${form.tax}%)`, value: totals.taxAmt },
                      { label: 'Discount', value: -form.discount },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8' }}>
                        <span>{row.label}</span>
                        <span style={{ color: row.value < 0 ? '#ef4444' : 'white' }}>₹{Math.abs(row.value).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: 'white' }}>Total</span>
                      <span style={{ fontWeight: 800, fontSize: 18, color: '#10b981' }}>₹{totals.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>
                      <span>Estimated Profit</span>
                      <span>₹{totals.profit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FileText size={15} /> Confirm Sale
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
