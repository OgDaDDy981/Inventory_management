'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInventoryStore } from '@/lib/store';
import { Download, FileText, FileSpreadsheet, Package, TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename} exported as CSV!`);
}

export default function Reports() {
  const { products, sales, stockMovements, suppliers } = useInventoryStore();

  const reportCards = [
    {
      title: 'Inventory Report',
      description: 'Complete list of all products with stock levels, pricing, and storage details',
      icon: Package,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.25)',
      stats: [
        { label: 'Total Products', value: products.length },
        { label: 'Total Stock Units', value: products.reduce((s, p) => s + p.quantity, 0).toLocaleString() },
        { label: 'Inventory Value', value: `₹${products.reduce((s, p) => s + p.purchasePrice * p.quantity, 0).toLocaleString('en-IN')}` },
      ],
      onExportCSV: () => exportCSV('Inventory_Report', ['Name', 'SKU', 'Category', 'Supplier', 'Purchase Price', 'Selling Price', 'Quantity', 'Min Threshold', 'Storage', 'Expiry Date'],
        products.map(p => [p.name, p.sku, p.category, p.supplier, p.purchasePrice, p.sellingPrice, p.quantity, p.minStockThreshold, p.storageLocation || '', p.expiryDate || ''])
      ),
    },
    {
      title: 'Profit Report',
      description: 'Product-wise profit margins, category profitability, and overall financial summary',
      icon: TrendingUp,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.25)',
      stats: [
        { label: 'Avg. Margin', value: products.length ? `${(products.reduce((s, p) => s + (p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100, 0) / products.length).toFixed(1)}%` : '0%' },
        { label: 'Potential Profit', value: `₹${products.reduce((s, p) => s + (p.sellingPrice - p.purchasePrice) * p.quantity, 0).toLocaleString('en-IN')}` },
        { label: 'Realized Profit', value: `₹${sales.reduce((s, sale) => s + sale.profit, 0).toLocaleString('en-IN')}` },
      ],
      onExportCSV: () => exportCSV('Profit_Report', ['Product', 'SKU', 'Category', 'Purchase Price', 'Selling Price', 'Profit/Unit', 'Margin %', 'Stock', 'Total Potential Profit'],
        products.map(p => [p.name, p.sku, p.category, p.purchasePrice, p.sellingPrice, p.sellingPrice - p.purchasePrice, ((p.sellingPrice - p.purchasePrice) / p.sellingPrice * 100).toFixed(2), p.quantity, (p.sellingPrice - p.purchasePrice) * p.quantity])
      ),
    },
    {
      title: 'Expiry Report',
      description: 'Products with expiry tracking including expired, critical, and near-expiry items',
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.25)',
      stats: (() => {
        const today = new Date();
        const withExpiry = products.filter(p => p.expiryDate);
        const expired = withExpiry.filter(p => new Date(p.expiryDate!) < today).length;
        const expiringSoon = withExpiry.filter(p => {
          const d = new Date(p.expiryDate!);
          const diff = (d.getTime() - today.getTime()) / 86400000;
          return diff >= 0 && diff <= 30;
        }).length;
        return [
          { label: 'With Expiry Date', value: withExpiry.length },
          { label: 'Expired', value: expired },
          { label: 'Expiring ≤30d', value: expiringSoon },
        ];
      })(),
      onExportCSV: () => {
        const withExpiry = products.filter(p => p.expiryDate);
        const today = new Date();
        exportCSV('Expiry_Report', ['Product', 'SKU', 'Category', 'Expiry Date', 'Days Remaining', 'Status', 'Quantity'],
          withExpiry.map(p => {
            const days = Math.ceil((new Date(p.expiryDate!).getTime() - today.getTime()) / 86400000);
            const status = days < 0 ? 'EXPIRED' : days <= 7 ? 'CRITICAL' : days <= 30 ? 'WARNING' : 'SAFE';
            return [p.name, p.sku, p.category, p.expiryDate!, days, status, p.quantity];
          })
        );
      },
    },
    {
      title: 'Sales Report',
      description: 'Complete sales history with customer details, revenue, profit, and order status',
      icon: ShoppingCart,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)',
      border: 'rgba(139,92,246,0.25)',
      stats: [
        { label: 'Total Orders', value: sales.length },
        { label: 'Total Revenue', value: `₹${sales.reduce((s, sale) => s + sale.totalAmount, 0).toLocaleString('en-IN')}` },
        { label: 'Total Profit', value: `₹${sales.reduce((s, sale) => s + sale.profit, 0).toLocaleString('en-IN')}` },
      ],
      onExportCSV: () => exportCSV('Sales_Report', ['Sale ID', 'Customer', 'Items', 'Tax %', 'Discount', 'Total Amount', 'Profit', 'Status', 'Date'],
        sales.map(s => [s.id.slice(0, 8), s.customerName, s.items.length, s.tax, s.discount, s.totalAmount, s.profit, s.status, format(new Date(s.date), 'yyyy-MM-dd')])
      ),
    },
  ];

  // Summary stats
  const summaryStats = useMemo(() => ({
    totalProducts: products.length,
    totalProfit: sales.reduce((s, sale) => s + sale.profit, 0),
    totalRevenue: sales.reduce((s, sale) => s + sale.totalAmount, 0),
    lowStockCount: products.filter(p => p.quantity <= p.minStockThreshold).length,
    totalSuppliers: suppliers.length,
    totalMovements: stockMovements.length,
  }), [products, sales, suppliers, stockMovements]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '22px 28px' }}>
        <h3 style={{ fontWeight: 800, fontSize: 18, color: 'white', marginBottom: 16, fontFamily: 'Space Grotesk' }}>Business Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {[
            { label: 'Products', value: summaryStats.totalProducts, color: '#3b82f6' },
            { label: 'Revenue', value: `₹${(summaryStats.totalRevenue / 1000).toFixed(1)}k`, color: '#10b981' },
            { label: 'Profit', value: `₹${(summaryStats.totalProfit / 1000).toFixed(1)}k`, color: '#8b5cf6' },
            { label: 'Low Stock', value: summaryStats.lowStockCount, color: '#f59e0b' },
            { label: 'Suppliers', value: summaryStats.totalSuppliers, color: '#06b6d4' },
            { label: 'Movements', value: summaryStats.totalMovements, color: '#ec4899' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {reportCards.map(card => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 20, padding: '24px 26px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ background: `${card.color}20`, borderRadius: 12, padding: 10 }}>
                  <Icon size={22} color={card.color} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>{card.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{card.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 18, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {card.stats.map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Export buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={card.onExportCSV}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <FileSpreadsheet size={15} color="#10b981" /> Export CSV
                </button>
                <button
                  onClick={() => toast('PDF export coming soon!', { icon: '📄' })}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <FileText size={15} color="#ef4444" /> Export PDF
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stock movement report */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>Stock Movement Report</h3>
          <button
            onClick={() => exportCSV('Stock_Movements', ['Product', 'Type', 'Quantity', 'Note', 'Date'],
              stockMovements.map(m => [m.productName, m.type, m.quantity, m.note, format(new Date(m.date), 'yyyy-MM-dd HH:mm')])
            )}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Stock In', value: stockMovements.filter(m => m.type === 'stock_in').reduce((s, m) => s + m.quantity, 0), color: '#10b981' },
            { label: 'Stock Out', value: stockMovements.filter(m => m.type === 'stock_out').reduce((s, m) => s + m.quantity, 0), color: '#3b82f6' },
            { label: 'Returns', value: stockMovements.filter(m => m.type === 'return').reduce((s, m) => s + m.quantity, 0), color: '#f59e0b' },
            { label: 'Damaged', value: stockMovements.filter(m => m.type === 'damaged').reduce((s, m) => s + m.quantity, 0), color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Total {s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
