'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore, Supplier } from '@/lib/store';
import { Plus, X, Search, Truck, Mail, Phone, MapPin, Edit2, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

function SupplierForm({ supplier, onClose, onSubmit }: { supplier?: Supplier; onClose: () => void; onSubmit: (d: any) => void }) {
  const [form, setForm] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    contactPerson: supplier?.contactPerson || '',
    products: supplier?.products || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    onSubmit(form);
  };

  const f = (label: string, name: string, type = 'text') => (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input className="input-field" type={type} name={name} value={(form as any)[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} placeholder={label} />
    </div>
  );

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))', borderRadius: '24px 24px 0 0' }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><Truck size={18} color="#8b5cf6" />{supplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {f('Company Name *', 'name')}
          {f('Email *', 'email', 'email')}
          {f('Phone', 'phone', 'tel')}
          {f('Contact Person', 'contactPerson')}
          {f('Address', 'address')}
          <div style={{ display: 'flex', gap: 12, paddingTop: 6 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{supplier ? 'Update' : 'Add Supplier'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | undefined>();

  const filtered = useMemo(() =>
    suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())),
    [suppliers, search]
  );

  const handleSubmit = (data: any) => {
    if (editSupplier) {
      updateSupplier(editSupplier.id, data);
      toast.success('Supplier updated!');
    } else {
      addSupplier(data);
      toast.success('Supplier added!');
    }
    setShowForm(false);
    setEditSupplier(undefined);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove supplier "${name}"?`)) {
      deleteSupplier(id);
      toast.success('Supplier removed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => { setEditSupplier(undefined); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* Grid cards */}
      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
          <Truck size={48} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p>No suppliers found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          <AnimatePresence>
            {filtered.map(s => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card"
                style={{ padding: '22px 24px' }}
                layout
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Truck size={22} color="#8b5cf6" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {s.products.length} product{s.products.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setEditSupplier(s); setShowForm(true); }} style={{ background: 'rgba(139,92,246,0.1)', border: 'none', borderRadius: 8, padding: 7, color: '#8b5cf6', cursor: 'pointer' }}><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(s.id, s.name)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, padding: 7, color: '#ef4444', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                    <User size={13} color="#64748b" />{s.contactPerson || 'N/A'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                    <Mail size={13} color="#64748b" />
                    <a href={`mailto:${s.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{s.email}</a>
                  </div>
                  {s.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                      <Phone size={13} color="#64748b" />{s.phone}
                    </div>
                  )}
                  {s.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                      <MapPin size={13} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />{s.address}
                    </div>
                  )}
                </div>

                {s.products.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Products</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {s.products.slice(0, 4).map(sku => (
                        <span key={sku} className="badge badge-blue" style={{ fontSize: 11 }}>{sku}</span>
                      ))}
                      {s.products.length > 4 && <span className="badge badge-purple" style={{ fontSize: 11 }}>+{s.products.length - 4} more</span>}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && <SupplierForm supplier={editSupplier} onClose={() => { setShowForm(false); setEditSupplier(undefined); }} onSubmit={handleSubmit} />}
      </AnimatePresence>
    </div>
  );
}
