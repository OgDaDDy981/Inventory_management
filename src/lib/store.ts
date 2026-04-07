import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minStockThreshold: number;
  expiryDate?: string;
  manufacturingDate?: string;
  barcode?: string;
  batchNumber?: string;
  imageUrl?: string;
  storageLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  products: string[];
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'return' | 'damaged';
  quantity: number;
  note: string;
  date: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface Sale {
  id: string;
  customerName: string;
  items: SaleItem[];
  tax: number;
  discount: number;
  totalAmount: number;
  profit: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  date: string;
  status: 'received' | 'pending' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'expiring' | 'expired' | 'large_sale' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface InventoryStore {
  products: Product[];
  suppliers: Supplier[];
  stockMovements: StockMovement[];
  sales: Sale[];
  purchases: Purchase[];
  notifications: Notification[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Stock movement actions
  addStockMovement: (movement: Omit<StockMovement, 'id'>) => void;
  
  // Sale actions
  addSale: (sale: Omit<Sale, 'id'>) => void;
  
  // Purchase actions
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
}

// --- Sample product IDs (stable for cross-references) ---
const pid1 = uuidv4(); // Laptop Pro 15"
const pid2 = uuidv4(); // Wireless Mouse
const pid3 = uuidv4(); // Vitamin C Tablets
const pid4 = uuidv4(); // USB-C Hub 7-in-1
const pid5 = uuidv4(); // Protein Shake Vanilla
const pid6 = uuidv4(); // Mechanical Keyboard
const pid7 = uuidv4(); // Running Shoes Pro
const pid8 = uuidv4(); // Compression Tights
const pid9 = uuidv4(); // Men's Formal Shirt
const pid10 = uuidv4(); // Yoga Mat Premium
const pid11 = uuidv4(); // First Aid Kit
const pid12 = uuidv4(); // Noise-Cancelling Headphones

const sid1 = uuidv4(); // TechWorld Inc
const sid2 = uuidv4(); // PharmaCo
const sid3 = uuidv4(); // FitLife Co
const sid4 = uuidv4(); // UrbanWear Co
const sid5 = uuidv4(); // SportGear Ltd

const sampleProducts: Product[] = [
  {
    id: pid1, name: 'Laptop Pro 15"', sku: 'LAP-001', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 45000, sellingPrice: 65000,
    quantity: 24, minStockThreshold: 5, expiryDate: '',
    manufacturingDate: '2024-01-15', barcode: '8901234567890',
    batchNumber: 'BAT-2024-001', storageLocation: 'A-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid2, name: 'Wireless Mouse', sku: 'MOU-002', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 500, sellingPrice: 1200,
    quantity: 3, minStockThreshold: 10, expiryDate: '',
    manufacturingDate: '2024-03-01', barcode: '8901234567891',
    batchNumber: 'BAT-2024-002', storageLocation: 'A-02', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid3, name: 'Vitamin C Tablets', sku: 'VIT-003', category: 'Health',
    supplier: 'PharmaCo', purchasePrice: 120, sellingPrice: 280,
    quantity: 150, minStockThreshold: 20, expiryDate: '2026-03-20',
    manufacturingDate: '2024-03-01', barcode: '8901234567892',
    batchNumber: 'BAT-2024-003', storageLocation: 'B-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid4, name: 'USB-C Hub 7-in-1', sku: 'ACC-006', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 1200, sellingPrice: 2500,
    quantity: 45, minStockThreshold: 10, expiryDate: '',
    manufacturingDate: '2024-01-20', barcode: '8901234567895',
    batchNumber: 'BAT-2024-006', storageLocation: 'A-03', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid5, name: 'Protein Shake Vanilla', sku: 'PRO-007', category: 'Health',
    supplier: 'FitLife Co', purchasePrice: 800, sellingPrice: 1600,
    quantity: 2, minStockThreshold: 15, expiryDate: '2025-12-31',
    manufacturingDate: '2024-01-05', barcode: '8901234567896',
    batchNumber: 'BAT-2024-007', storageLocation: 'B-02', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid6, name: 'Mechanical Keyboard', sku: 'KEY-008', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 3500, sellingPrice: 6500,
    quantity: 18, minStockThreshold: 5, expiryDate: '',
    manufacturingDate: '2024-02-15', barcode: '8901234567897',
    batchNumber: 'BAT-2024-008', storageLocation: 'A-04', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid7, name: 'Running Shoes Pro', sku: 'SPT-009', category: 'Sports',
    supplier: 'SportGear Ltd', purchasePrice: 3200, sellingPrice: 5800,
    quantity: 36, minStockThreshold: 8, expiryDate: '',
    manufacturingDate: '2024-02-01', barcode: '8901234567898',
    batchNumber: 'BAT-2024-009', storageLocation: 'C-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid8, name: 'Compression Tights', sku: 'SPT-010', category: 'Sports',
    supplier: 'SportGear Ltd', purchasePrice: 900, sellingPrice: 2200,
    quantity: 60, minStockThreshold: 12, expiryDate: '',
    manufacturingDate: '2024-03-10', barcode: '8901234567899',
    batchNumber: 'BAT-2024-010', storageLocation: 'C-02', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid9, name: "Men's Formal Shirt", sku: 'CLO-011', category: 'Clothing',
    supplier: 'UrbanWear Co', purchasePrice: 650, sellingPrice: 1500,
    quantity: 42, minStockThreshold: 10, expiryDate: '',
    manufacturingDate: '2024-01-25', barcode: '8901234567900',
    batchNumber: 'BAT-2024-011', storageLocation: 'D-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid10, name: 'Yoga Mat Premium', sku: 'SPT-012', category: 'Sports',
    supplier: 'SportGear Ltd', purchasePrice: 700, sellingPrice: 1800,
    quantity: 4, minStockThreshold: 10, expiryDate: '',
    manufacturingDate: '2024-02-20', barcode: '8901234567901',
    batchNumber: 'BAT-2024-012', storageLocation: 'C-03', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid11, name: 'First Aid Kit', sku: 'HLT-013', category: 'Health',
    supplier: 'PharmaCo', purchasePrice: 350, sellingPrice: 850,
    quantity: 28, minStockThreshold: 8, expiryDate: '2027-06-15',
    manufacturingDate: '2024-06-01', barcode: '8901234567902',
    batchNumber: 'BAT-2024-013', storageLocation: 'B-03', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid12, name: 'Noise-Cancelling Headphones', sku: 'AUD-014', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 6000, sellingPrice: 12000,
    quantity: 14, minStockThreshold: 4, expiryDate: '',
    manufacturingDate: '2024-03-15', barcode: '8901234567903',
    batchNumber: 'BAT-2024-014', storageLocation: 'A-05', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
];

const sampleSuppliers: Supplier[] = [
  {
    id: sid1, name: 'TechWorld Inc', email: 'contact@techworld.com',
    phone: '+91 9876543210', address: '123, Tech Park, Bangalore', contactPerson: 'Raj Sharma',
    products: ['LAP-001', 'MOU-002', 'ACC-006', 'KEY-008', 'AUD-014'], createdAt: new Date().toISOString()
  },
  {
    id: sid2, name: 'PharmaCo', email: 'sales@pharmaco.com',
    phone: '+91 9876543211', address: '456, Pharma Hub, Mumbai', contactPerson: 'Priya Mehta',
    products: ['VIT-003', 'HLT-013'], createdAt: new Date().toISOString()
  },
  {
    id: sid3, name: 'FitLife Co', email: 'business@fitlife.com',
    phone: '+91 9876543214', address: '654, Health Lane, Delhi', contactPerson: 'Vikram Singh',
    products: ['PRO-007'], createdAt: new Date().toISOString()
  },
  {
    id: sid4, name: 'UrbanWear Co', email: 'orders@urbanwear.com',
    phone: '+91 9876543215', address: '88, Fashion Street, Mumbai', contactPerson: 'Aarti Desai',
    products: ['CLO-011'], createdAt: new Date().toISOString()
  },
  {
    id: sid5, name: 'SportGear Ltd', email: 'info@sportgear.com',
    phone: '+91 9876543216', address: '42, Stadium Road, Pune', contactPerson: 'Rohan Joshi',
    products: ['SPT-009', 'SPT-010', 'SPT-012'], createdAt: new Date().toISOString()
  },
];

const sampleSales: Sale[] = [
  {
    id: uuidv4(), customerName: 'Ananya Roy',
    items: [{ productId: pid1, productName: 'Laptop Pro 15"', quantity: 1, price: 65000, discount: 2000 }],
    tax: 8, discount: 2000, totalAmount: 68220, profit: 18000, date: new Date(Date.now() - 86400000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Rahul Gupta',
    items: [{ productId: pid4, productName: 'USB-C Hub 7-in-1', quantity: 3, price: 2500, discount: 0 }],
    tax: 18, discount: 0, totalAmount: 8850, profit: 3900, date: new Date(Date.now() - 172800000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Meera Iyer',
    items: [{ productId: pid7, productName: 'Running Shoes Pro', quantity: 2, price: 5800, discount: 500 }],
    tax: 12, discount: 500, totalAmount: 12432, profit: 5200, date: new Date(Date.now() - 259200000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Karan Bhatia',
    items: [
      { productId: pid9, productName: "Men's Formal Shirt", quantity: 3, price: 1500, discount: 0 },
      { productId: pid8, productName: 'Compression Tights', quantity: 2, price: 2200, discount: 200 },
    ],
    tax: 12, discount: 200, totalAmount: 9352, profit: 5150, date: new Date(Date.now() - 345600000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Sneha Patel',
    items: [{ productId: pid12, productName: 'Noise-Cancelling Headphones', quantity: 1, price: 12000, discount: 1000 }],
    tax: 18, discount: 1000, totalAmount: 12980, profit: 6000, date: new Date(Date.now() - 432000000).toISOString(), status: 'completed'
  },
];

const sampleMovements: StockMovement[] = [
  { id: uuidv4(), productId: pid1, productName: 'Laptop Pro 15"', type: 'stock_in', quantity: 10, note: 'New stock received from TechWorld', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: uuidv4(), productId: pid2, productName: 'Wireless Mouse', type: 'stock_out', quantity: 5, note: 'Bulk order #1234', date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: uuidv4(), productId: pid3, productName: 'Vitamin C Tablets', type: 'return', quantity: 2, note: 'Customer return — wrong item', date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: uuidv4(), productId: pid5, productName: 'Protein Shake Vanilla', type: 'damaged', quantity: 3, note: 'Damaged during storage', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: uuidv4(), productId: pid7, productName: 'Running Shoes Pro', type: 'stock_in', quantity: 20, note: 'Seasonal restock', date: new Date(Date.now() - 86400000).toISOString() },
  { id: uuidv4(), productId: pid9, productName: "Men's Formal Shirt", type: 'stock_in', quantity: 15, note: 'New collection arrival', date: new Date().toISOString() },
];

const samplePurchases: Purchase[] = [
  {
    id: uuidv4(), supplierId: sid1, supplierName: 'TechWorld Inc',
    items: [
      { productId: pid1, productName: 'Laptop Pro 15"', quantity: 10, price: 45000 },
      { productId: pid6, productName: 'Mechanical Keyboard', quantity: 20, price: 3500 },
    ],
    totalAmount: 520000, date: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'received'
  },
  {
    id: uuidv4(), supplierId: sid5, supplierName: 'SportGear Ltd',
    items: [
      { productId: pid7, productName: 'Running Shoes Pro', quantity: 20, price: 3200 },
      { productId: pid8, productName: 'Compression Tights', quantity: 30, price: 900 },
    ],
    totalAmount: 91000, date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'received'
  },
  {
    id: uuidv4(), supplierId: sid4, supplierName: 'UrbanWear Co',
    items: [
      { productId: pid9, productName: "Men's Formal Shirt", quantity: 15, price: 650 },
    ],
    totalAmount: 9750, date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'received'
  },
  {
    id: uuidv4(), supplierId: sid2, supplierName: 'PharmaCo',
    items: [
      { productId: pid3, productName: 'Vitamin C Tablets', quantity: 100, price: 120 },
      { productId: pid11, productName: 'First Aid Kit', quantity: 15, price: 350 },
    ],
    totalAmount: 17250, date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'pending'
  },
];

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: sampleProducts,
  suppliers: sampleSuppliers,
  stockMovements: sampleMovements,
  sales: sampleSales,
  purchases: samplePurchases,
  notifications: [
    { id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: 'Wireless Mouse is running low (3 left)', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: 'Protein Shake Vanilla is critically low (2 left)', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: 'Yoga Mat Premium is running low (4 left)', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'expiring', title: 'Expiry Warning', message: 'Vitamin C Tablets expiring on 2026-03-20', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'large_sale', title: 'Large Sale', message: 'Sale of ₹68,220 completed for Ananya Roy', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'info', title: 'Purchase Order', message: 'New purchase of ₹17,250 from PharmaCo is pending', date: new Date().toISOString(), read: false },
  ],

  addProduct: (product) => set((state) => {
    const newProduct = { ...product, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const newProducts = [newProduct, ...state.products];
    const notifications = [...state.notifications];
    if (product.quantity <= product.minStockThreshold) {
      notifications.push({ id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: `${product.name} added with low stock (${product.quantity} units)`, date: new Date().toISOString(), read: false });
    }
    return { products: newProducts, notifications };
  }),

  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct, updatedAt: new Date().toISOString() } : p)
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  addSupplier: (supplier) => set((state) => ({
    suppliers: [{ ...supplier, id: uuidv4(), createdAt: new Date().toISOString() }, ...state.suppliers]
  })),

  updateSupplier: (id, updatedSupplier) => set((state) => ({
    suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s)
  })),

  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter(s => s.id !== id)
  })),

  addStockMovement: (movement) => set((state) => {
    const newMovement = { ...movement, id: uuidv4() };
    const updatedProducts = state.products.map(p => {
      if (p.id === movement.productId) {
        let newQty = p.quantity;
        if (movement.type === 'stock_in' || movement.type === 'return') newQty += movement.quantity;
        else newQty = Math.max(0, newQty - movement.quantity);
        return { ...p, quantity: newQty, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    return { stockMovements: [newMovement, ...state.stockMovements], products: updatedProducts };
  }),

  addSale: (sale) => set((state) => {
    const newSale = { ...sale, id: uuidv4() };
    const updatedProducts = state.products.map(p => {
      const saleItem = sale.items.find(i => i.productId === p.id);
      if (saleItem) return { ...p, quantity: Math.max(0, p.quantity - saleItem.quantity), updatedAt: new Date().toISOString() };
      return p;
    });
    const notifications = [...state.notifications];
    if (sale.totalAmount > 50000) {
      notifications.push({ id: uuidv4(), type: 'large_sale', title: 'Large Sale Alert!', message: `Sale of ₹${sale.totalAmount.toLocaleString()} for ${sale.customerName}`, date: new Date().toISOString(), read: false });
    }
    return { sales: [newSale, ...state.sales], products: updatedProducts, notifications };
  }),

  addPurchase: (purchase) => set((state) => {
    const newPurchase = { ...purchase, id: uuidv4() };
    const updatedProducts = state.products.map(p => {
      const purchaseItem = purchase.items.find(i => i.productId === p.id);
      if (purchaseItem && purchase.status === 'received') {
        return { ...p, quantity: p.quantity + purchaseItem.quantity, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    return { purchases: [newPurchase, ...state.purchases], products: updatedProducts };
  }),

  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: uuidv4() }, ...state.notifications]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  clearNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));
