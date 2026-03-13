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

const sampleProducts: Product[] = [
  {
    id: uuidv4(), name: 'Laptop Pro 15"', sku: 'LAP-001', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 45000, sellingPrice: 65000,
    quantity: 24, minStockThreshold: 5, expiryDate: '',
    manufacturingDate: '2024-01-15', barcode: '8901234567890',
    batchNumber: 'BAT-2024-001', storageLocation: 'A-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Wireless Mouse', sku: 'MOU-002', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 500, sellingPrice: 1200,
    quantity: 3, minStockThreshold: 10, expiryDate: '',
    manufacturingDate: '2024-03-01', barcode: '8901234567891',
    batchNumber: 'BAT-2024-002', storageLocation: 'A-02', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Vitamin C Tablets', sku: 'VIT-003', category: 'Health',
    supplier: 'PharmaCo', purchasePrice: 120, sellingPrice: 280,
    quantity: 150, minStockThreshold: 20, expiryDate: '2026-03-20',
    manufacturingDate: '2024-03-01', barcode: '8901234567892',
    batchNumber: 'BAT-2024-003', storageLocation: 'B-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Organic Green Tea', sku: 'TEA-004', category: 'Food & Beverage',
    supplier: 'Nature Farms', purchasePrice: 200, sellingPrice: 450,
    quantity: 80, minStockThreshold: 15, expiryDate: '2026-08-30',
    manufacturingDate: '2024-02-10', barcode: '8901234567893',
    batchNumber: 'BAT-2024-004', storageLocation: 'C-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Office Chair Pro', sku: 'FUR-005', category: 'Furniture',
    supplier: 'FurniturePlus', purchasePrice: 8000, sellingPrice: 14000,
    quantity: 12, minStockThreshold: 3, expiryDate: '',
    manufacturingDate: '2023-11-01', barcode: '8901234567894',
    batchNumber: 'BAT-2024-005', storageLocation: 'D-01', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'USB-C Hub 7-in-1', sku: 'ACC-006', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 1200, sellingPrice: 2500,
    quantity: 45, minStockThreshold: 10, expiryDate: '',
    manufacturingDate: '2024-01-20', barcode: '8901234567895',
    batchNumber: 'BAT-2024-006', storageLocation: 'A-03', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Protein Shake Vanilla', sku: 'PRO-007', category: 'Health',
    supplier: 'FitLife Co', purchasePrice: 800, sellingPrice: 1600,
    quantity: 2, minStockThreshold: 15, expiryDate: '2025-12-31',
    manufacturingDate: '2024-01-05', barcode: '8901234567896',
    batchNumber: 'BAT-2024-007', storageLocation: 'B-02', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Mechanical Keyboard', sku: 'KEY-008', category: 'Electronics',
    supplier: 'TechWorld Inc', purchasePrice: 3500, sellingPrice: 6500,
    quantity: 18, minStockThreshold: 5, expiryDate: '',
    manufacturingDate: '2024-02-15', barcode: '8901234567897',
    batchNumber: 'BAT-2024-008', storageLocation: 'A-04', imageUrl: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
];

const sampleSuppliers: Supplier[] = [
  {
    id: uuidv4(), name: 'TechWorld Inc', email: 'contact@techworld.com',
    phone: '+91 9876543210', address: '123, Tech Park, Bangalore', contactPerson: 'Raj Sharma',
    products: ['LAP-001', 'MOU-002', 'ACC-006', 'KEY-008'], createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'PharmaCo', email: 'sales@pharmaco.com',
    phone: '+91 9876543211', address: '456, Pharma Hub, Mumbai', contactPerson: 'Priya Mehta',
    products: ['VIT-003'], createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Nature Farms', email: 'info@naturefarms.com',
    phone: '+91 9876543212', address: '789, Green Valley, Pune', contactPerson: 'Arjun Patel',
    products: ['TEA-004'], createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'FurniturePlus', email: 'orders@furnitureplus.com',
    phone: '+91 9876543213', address: '321, Craft Zone, Jaipur', contactPerson: 'Sneha Nair',
    products: ['FUR-005'], createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'FitLife Co', email: 'business@fitlife.com',
    phone: '+91 9876543214', address: '654, Health Lane, Delhi', contactPerson: 'Vikram Singh',
    products: ['PRO-007'], createdAt: new Date().toISOString()
  },
];

const sampleSales: Sale[] = [
  {
    id: uuidv4(), customerName: 'Ananya Roy',
    items: [{ productId: '1', productName: 'Laptop Pro 15"', quantity: 1, price: 65000, discount: 2000 }],
    tax: 8, discount: 2000, totalAmount: 68220, profit: 18000, date: new Date(Date.now() - 86400000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Rahul Gupta',
    items: [{ productId: '2', productName: 'USB-C Hub 7-in-1', quantity: 3, price: 2500, discount: 0 }],
    tax: 18, discount: 0, totalAmount: 8850, profit: 3900, date: new Date(Date.now() - 172800000).toISOString(), status: 'completed'
  },
  {
    id: uuidv4(), customerName: 'Meera Iyer',
    items: [{ productId: '3', productName: 'Organic Green Tea', quantity: 5, price: 450, discount: 100 }],
    tax: 5, discount: 100, totalAmount: 2237, profit: 1250, date: new Date(Date.now() - 259200000).toISOString(), status: 'completed'
  },
];

const sampleMovements: StockMovement[] = [
  { id: uuidv4(), productId: '1', productName: 'Laptop Pro 15"', type: 'stock_in', quantity: 10, note: 'New stock received', date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: uuidv4(), productId: '2', productName: 'Wireless Mouse', type: 'stock_out', quantity: 5, note: 'Sale order #1234', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: uuidv4(), productId: '3', productName: 'Vitamin C Tablets', type: 'return', quantity: 2, note: 'Customer return', date: new Date(Date.now() - 86400000).toISOString() },
  { id: uuidv4(), productId: '7', productName: 'Protein Shake Vanilla', type: 'damaged', quantity: 3, note: 'Damaged in storage', date: new Date().toISOString() },
];

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: sampleProducts,
  suppliers: sampleSuppliers,
  stockMovements: sampleMovements,
  sales: sampleSales,
  purchases: [],
  notifications: [
    { id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: 'Wireless Mouse is running low (3 left)', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: 'Protein Shake Vanilla is critically low (2 left)', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'expiring', title: 'Expiry Warning', message: 'Vitamin C Tablets expiring on 2026-03-20', date: new Date().toISOString(), read: false },
    { id: uuidv4(), type: 'large_sale', title: 'Large Sale', message: 'Sale of ₹68,220 completed for Ananya Roy', date: new Date().toISOString(), read: false },
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
