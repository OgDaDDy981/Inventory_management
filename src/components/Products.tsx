'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore, Product } from '@/lib/store';
import { Plus, Search, Edit2, Trash2, Eye, Filter, X, ChevronDown, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Health', 'Food & Beverage', 'Furniture', 'Clothing', 'Sports', 'Books', 'Other'];

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || 'Electronics',
    supplier: product?.supplier || '',
    purchasePrice: product?.purchasePrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    quantity: product?.quantity || 0,
    minStockThreshold: product?.minStockThreshold || 10,
    expiryDate: product?.expiryDate || '',
    manufacturingDate: product?.manufacturingDate || '',
    barcode: product?.barcode || '',
    batchNumber: product?.batchNumber || '',
    storageLocation: product?.storageLocation || '',
    imageUrl: product?.imageUrl || '',
  });

  const margin = form.sellingPrice > 0 ? ((form.sellingPrice - form.purchasePrice) / form.sellingPrice * 100).toFixed(1) : '0';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: ['purchasePrice', 'sellingPrice', 'quantity', 'minStockThreshold'].includes(name) ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku) { toast.error('Name and SKU are required'); return; }
    onSubmit(form);
  };

  const field = (label: string, name: string, type = 'text', extra?: any) => (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input
        className="input-field"
        type={type}
        name={name}
        value={(form as any)[name]}
        onChange={handleChange}
        placeholder={label}
        step={type === 'number' ? '0.01' : undefined}
        min={type === 'number' ? 0 : undefined}
        {...extra}
      />
    </div>
  );

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', borderRadius: '24px 24px 0 0' }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: 'white', fontFamily: 'Space Grotesk' }}>{product ? 'Edit Product' : 'Add New Product'}</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Fill in product details below</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Margin indicator */}
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Profit Margin</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{margin}%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('Product Name *', 'name')}
            {field('SKU *', 'sku')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
              <select className="input-field" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {field('Supplier', 'supplier')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('Purchase Price (₹)', 'purchasePrice', 'number')}
            {field('Selling Price (₹)', 'sellingPrice', 'number')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('Current Quantity', 'quantity', 'number')}
            {field('Min Stock Threshold', 'minStockThreshold', 'number')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('Manufacturing Date', 'manufacturingDate', 'date')}
            {field('Expiry Date', 'expiryDate', 'date')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('Barcode', 'barcode')}
            {field('Batch Number', 'batchNumber')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {field('Storage Location', 'storageLocation')}
            {field('Image URL', 'imageUrl', 'url')}
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const today = new Date();
  const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;
  const daysToExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const margin = ((product.sellingPrice - product.purchasePrice) / product.sellingPrice * 100).toFixed(1);

  const getExpiryBadge = () => {
    if (!daysToExpiry) return null;
    if (daysToExpiry < 0) return <span className="badge badge-red">Expired</span>;
    if (daysToExpiry <= 30) return <span className="badge badge-yellow">Expiring in {daysToExpiry}d</span>;
    return <span className="badge badge-green">Good until {product.expiryDate}</span>;
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>Product Details</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: 16, background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {product.imageUrl ? <img src={product.imageUrl} alt="" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover' }} /> : <Package size={36} color="#3b82f6" />}
            </div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>{product.name}</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>SKU: {product.sku}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{product.category}</span>
                {product.quantity <= product.minStockThreshold && <span className="badge badge-yellow">Low Stock</span>}
                {getExpiryBadge()}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'Purchase Price', value: `₹${product.purchasePrice.toLocaleString('en-IN')}` },
              { label: 'Selling Price', value: `₹${product.sellingPrice.toLocaleString('en-IN')}` },
              { label: 'Profit Margin', value: `${margin}%`, color: '#10b981' },
              { label: 'Quantity', value: product.quantity, color: product.quantity <= product.minStockThreshold ? '#f59e0b' : 'white' },
              { label: 'Min Threshold', value: product.minStockThreshold },
              { label: 'Storage', value: product.storageLocation || '—' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: (item as any).color || 'white' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Supplier', value: product.supplier },
              { label: 'Batch Number', value: product.batchNumber || '—' },
              { label: 'Barcode', value: product.barcode || '—' },
              { label: 'Mfg. Date', value: product.manufacturingDate || '—' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [viewProduct, setViewProduct] = useState<Product | undefined>();
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'sellingPrice' | 'margin'>('name');

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.supplier.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'quantity') return b.quantity - a.quantity;
        if (sortBy === 'sellingPrice') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'margin') return ((b.sellingPrice - b.purchasePrice) / b.sellingPrice) - ((a.sellingPrice - a.purchasePrice) / a.sellingPrice);
        return 0;
      });
  }, [products, search, categoryFilter, sortBy]);

  const handleSubmit = (data: any) => {
    if (editProduct) {
      updateProduct(editProduct.id, data);
      toast.success('Product updated successfully!');
    } else {
      addProduct(data);
      toast.success('Product added successfully!');
    }
    setShowForm(false);
    setEditProduct(undefined);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProduct(id);
      toast.success('Product deleted');
    }
  };

  const getStockBadge = (p: Product) => {
    if (p.quantity === 0) return <span className="badge badge-red">Out of Stock</span>;
    if (p.quantity <= p.minStockThreshold) return <span className="badge badge-yellow">Low Stock</span>;
    return <span className="badge badge-green">In Stock</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: 14 }}>{filtered.length} products shown · {products.length} total</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditProduct(undefined); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add Product
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search products, SKU, supplier..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES.slice(0, 5)].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                background: categoryFilter === cat ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                color: categoryFilter === cat ? 'white' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
        </div>
        <select className="input-field" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
          <option value="name">Sort: Name</option>
          <option value="quantity">Sort: Stock</option>
          <option value="sellingPrice">Sort: Price</option>
          <option value="margin">Sort: Margin</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Purchase ₹</th>
              <th>Selling ₹</th>
              <th>Margin</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p) => {
                const margin = ((p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100).toFixed(1);
                const today = new Date();
                const expiryDate = p.expiryDate ? new Date(p.expiryDate) : null;
                const daysToExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;

                return (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} /> : <Package size={16} color="#3b82f6" />}
                        </div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{p.sku}</span></td>
                    <td><span className={`badge ${p.category === 'Electronics' ? 'badge-blue' : p.category === 'Health' ? 'badge-green' : p.category === 'Food & Beverage' ? 'badge-yellow' : 'badge-purple'}`}>{p.category}</span></td>
                    <td style={{ color: '#94a3b8' }}>{p.supplier || '—'}</td>
                    <td style={{ fontWeight: 600 }}>₹{p.purchasePrice.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 600, color: '#10b981' }}>₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                    <td><span style={{ color: parseFloat(margin) > 30 ? '#10b981' : parseFloat(margin) > 15 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{margin}%</span></td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.quantity <= p.minStockThreshold ? '#f59e0b' : 'white' }}>
                        {p.quantity}
                      </span>
                      <span style={{ color: '#475569', fontSize: 12 }}>/{p.minStockThreshold}</span>
                    </td>
                    <td>{getStockBadge(p)}</td>
                    <td>
                      {daysToExpiry === null ? <span style={{ color: '#475569' }}>N/A</span> :
                        daysToExpiry < 0 ? <span className="badge badge-red">Expired</span> :
                        daysToExpiry <= 30 ? <span className="badge badge-yellow">{daysToExpiry}d</span> :
                        <span style={{ color: '#10b981', fontSize: 13 }}>{p.expiryDate}</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setViewProduct(p)} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: 8, padding: 7, color: '#3b82f6', cursor: 'pointer' }}><Eye size={14} /></button>
                        <button onClick={() => { setEditProduct(p); setShowForm(true); }} style={{ background: 'rgba(139,92,246,0.1)', border: 'none', borderRadius: 8, padding: 7, color: '#8b5cf6', cursor: 'pointer' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, padding: 7, color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
            <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>No products found</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showForm && <ProductForm product={editProduct} onClose={() => { setShowForm(false); setEditProduct(undefined); }} onSubmit={handleSubmit} />}
        {viewProduct && <ViewModal product={viewProduct} onClose={() => setViewProduct(undefined)} />}
      </AnimatePresence>
    </div>
  );
}
