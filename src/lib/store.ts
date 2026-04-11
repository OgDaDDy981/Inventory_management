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
const pid1 = uuidv4(); // Gaming Laptop G15
const pid2 = uuidv4(); // Premium Cotton Hoodie

const sid1 = uuidv4(); // ElectroHub Distribution
const sid2 = uuidv4(); // Global Fashion Sourcing

const sampleProducts: Product[] = [
  {
    id: pid1, name: 'Gaming Laptop G15', sku: 'ELE-LP-001', category: 'Electronics',
    supplier: 'ElectroHub Distribution', purchasePrice: 75000, sellingPrice: 95000,
    quantity: 12, minStockThreshold: 3, expiryDate: '',
    manufacturingDate: '2024-02-10', barcode: '8901001001001',
    batchNumber: 'BAT-ELE-001', storageLocation: 'SEC-A1', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: pid2, name: 'Premium Cotton Hoodie', sku: 'FAS-HD-001', category: 'Fashion',
    supplier: 'Global Fashion Sourcing', purchasePrice: 1200, sellingPrice: 2800,
    quantity: 65, minStockThreshold: 15, expiryDate: '',
    manufacturingDate: '2024-04-01', barcode: '8902002002001',
    batchNumber: 'BAT-FAS-001', storageLocation: 'SEC-F1', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }
];

const sampleSuppliers: Supplier[] = [
  {
    id: sid1, name: 'ElectroHub Distribution', email: 'sales@electrohub.com',
    phone: '+91 9001001001', address: 'Tech Plaza, Electronics City, Bangalore', contactPerson: 'Arun Kumar',
    products: ['ELE-LP-001'], createdAt: new Date().toISOString()
  },
  {
    id: sid2, name: 'Global Fashion Sourcing', email: 'orders@globalfashion.com',
    phone: '+91 9002002002', address: 'Fashion Boulevard, Bandra West, Mumbai', contactPerson: 'Sarah Khan',
    products: ['FAS-HD-001'], createdAt: new Date().toISOString()
  },
];

const sampleSales: Sale[] = [
  {
    id: uuidv4(), customerName: 'Rohan Sharma',
    items: [{ productId: pid1, productName: 'Gaming Laptop G15', quantity: 1, price: 95000, discount: 5000 }],
    tax: 18, discount: 5000, totalAmount: 106200, profit: 20000, date: new Date(Date.now() - 86400000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Ishita Verma',
    items: [{ productId: pid2, productName: 'Premium Cotton Hoodie', quantity: 2, price: 2800, discount: 200 }],
    tax: 12, discount: 200, totalAmount: 6048, profit: 3000, date: new Date(Date.now() - 172800000).toISOString(), status: 'completed'
  }
];

const sampleMovements: StockMovement[] = [
  { id: uuidv4(), productId: pid1, productName: 'Gaming Laptop G15', type: 'stock_in', quantity: 10, note: 'Initial inventory restock', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: uuidv4(), productId: pid2, productName: 'Premium Cotton Hoodie', type: 'stock_in', quantity: 70, note: 'Seasonal stock arrival', date: new Date(Date.now() - 86400000 * 4).toISOString() },
];

const samplePurchases: Purchase[] = [
  {
    id: uuidv4(), supplierId: sid1, supplierName: 'ElectroHub Distribution',
    items: [
      { productId: pid1, productName: 'Gaming Laptop G15', quantity: 5, price: 75000 }
    ],
    totalAmount: 375000, date: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'received'
  },
  {
    id: uuidv4(), supplierId: sid2, supplierName: 'Global Fashion Sourcing',
    items: [
      { productId: pid2, productName: 'Premium Cotton Hoodie', quantity: 50, price: 1200 },
    ],
    totalAmount: 60000, date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'pending'
  },
];

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: sampleProducts,
  suppliers: sampleSuppliers,
  stockMovements: sampleMovements,
  sales: sampleSales,
  purchases: samplePurchases,
  notifications: [
    { id: uuidv4(), type: 'info', title: 'Pending Order', message: 'Purchase from Global Fashion Sourcing is pending', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'large_sale', title: 'High Value Sale', message: 'Sale of ₹1,06,200 completed for Rohan Sharma', date: new Date().toISOString(), read: false }
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
