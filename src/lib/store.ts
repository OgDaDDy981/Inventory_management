import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  _initialized: boolean;

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

  // Reset to defaults (for testing)
  resetToDefaults: () => void;
}

// ─── Stable IDs for cross-references ───────────────────────────────────────

// Electronics products
const pid_laptop   = 'p-ele-001';
const pid_phone    = 'p-ele-002';
const pid_tablet   = 'p-ele-003';
const pid_earbuds  = 'p-ele-004';
const pid_monitor  = 'p-ele-005';

// Fashion products
const pid_hoodie   = 'p-fas-001';
const pid_jeans    = 'p-fas-002';
const pid_sneakers = 'p-fas-003';
const pid_jacket   = 'p-fas-004';
const pid_tshirt   = 'p-fas-005';

// Supplier IDs
const sid_electrohub = 's-001';
const sid_nextech    = 's-002';
const sid_globalfash = 's-003';
const sid_trendline  = 's-004';

// ─── Sample Data ─────────────────────────────────────────────────────────────

const DEFAULT_PRODUCTS: Product[] = [
  // ── Electronics ───────────────────────────────────────────────────────────
  {
    id: pid_laptop,
    name: 'Gaming Laptop G15 Pro',
    sku: 'ELE-LP-001',
    category: 'Electronics',
    supplier: 'ElectroHub Distribution',
    purchasePrice: 72000,
    sellingPrice: 94999,
    quantity: 14,
    minStockThreshold: 3,
    manufacturingDate: '2024-01-15',
    expiryDate: '',
    barcode: '8901001001001',
    batchNumber: 'BAT-ELE-001',
    storageLocation: 'SEC-A1',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: pid_phone,
    name: 'Smartphone X12 Ultra',
    sku: 'ELE-PH-002',
    category: 'Electronics',
    supplier: 'NexTech Wholesale',
    purchasePrice: 42000,
    sellingPrice: 58999,
    quantity: 28,
    minStockThreshold: 5,
    manufacturingDate: '2024-03-10',
    expiryDate: '',
    barcode: '8901001002001',
    batchNumber: 'BAT-ELE-002',
    storageLocation: 'SEC-A2',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: pid_tablet,
    name: 'ProTab 11" AMOLED',
    sku: 'ELE-TB-003',
    category: 'Electronics',
    supplier: 'ElectroHub Distribution',
    purchasePrice: 28000,
    sellingPrice: 39999,
    quantity: 3,
    minStockThreshold: 4,
    manufacturingDate: '2024-02-20',
    expiryDate: '',
    barcode: '8901001003001',
    batchNumber: 'BAT-ELE-003',
    storageLocation: 'SEC-A3',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: pid_earbuds,
    name: 'ANC Earbuds Pro 5',
    sku: 'ELE-EB-004',
    category: 'Electronics',
    supplier: 'NexTech Wholesale',
    purchasePrice: 4500,
    sellingPrice: 8499,
    quantity: 55,
    minStockThreshold: 10,
    manufacturingDate: '2024-04-05',
    expiryDate: '',
    barcode: '8901001004001',
    batchNumber: 'BAT-ELE-004',
    storageLocation: 'SEC-A4',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: pid_monitor,
    name: '27" 4K Gaming Monitor',
    sku: 'ELE-MN-005',
    category: 'Electronics',
    supplier: 'ElectroHub Distribution',
    purchasePrice: 18500,
    sellingPrice: 27999,
    quantity: 9,
    minStockThreshold: 2,
    manufacturingDate: '2024-01-28',
    expiryDate: '',
    barcode: '8901001005001',
    batchNumber: 'BAT-ELE-005',
    storageLocation: 'SEC-A5',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },

  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    id: pid_hoodie,
    name: 'Premium Cotton Hoodie',
    sku: 'FAS-HD-001',
    category: 'Fashion',
    supplier: 'Global Fashion Sourcing',
    purchasePrice: 1200,
    sellingPrice: 2799,
    quantity: 72,
    minStockThreshold: 15,
    manufacturingDate: '2024-04-01',
    expiryDate: '',
    barcode: '8902002001001',
    batchNumber: 'BAT-FAS-001',
    storageLocation: 'SEC-F1',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: pid_jeans,
    name: 'Slim Fit Stretch Denim Jeans',
    sku: 'FAS-JN-002',
    category: 'Fashion',
    supplier: 'TrendLine Apparel',
    purchasePrice: 900,
    sellingPrice: 2299,
    quantity: 88,
    minStockThreshold: 20,
    manufacturingDate: '2024-03-15',
    expiryDate: '',
    barcode: '8902002002001',
    batchNumber: 'BAT-FAS-002',
    storageLocation: 'SEC-F2',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: pid_sneakers,
    name: 'Urban Runner Sneakers',
    sku: 'FAS-SN-003',
    category: 'Fashion',
    supplier: 'Global Fashion Sourcing',
    purchasePrice: 2200,
    sellingPrice: 4999,
    quantity: 6,
    minStockThreshold: 8,
    manufacturingDate: '2024-02-10',
    expiryDate: '',
    barcode: '8902002003001',
    batchNumber: 'BAT-FAS-003',
    storageLocation: 'SEC-F3',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 17).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: pid_jacket,
    name: 'Puffer Winter Jacket',
    sku: 'FAS-JK-004',
    category: 'Fashion',
    supplier: 'TrendLine Apparel',
    purchasePrice: 3500,
    sellingPrice: 7499,
    quantity: 41,
    minStockThreshold: 10,
    manufacturingDate: '2024-01-05',
    expiryDate: '',
    barcode: '8902002004001',
    batchNumber: 'BAT-FAS-004',
    storageLocation: 'SEC-F4',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: pid_tshirt,
    name: 'Graphic Tee — Oversized',
    sku: 'FAS-TS-005',
    category: 'Fashion',
    supplier: 'TrendLine Apparel',
    purchasePrice: 380,
    sellingPrice: 999,
    quantity: 130,
    minStockThreshold: 30,
    manufacturingDate: '2024-04-12',
    expiryDate: '',
    barcode: '8902002005001',
    batchNumber: 'BAT-FAS-005',
    storageLocation: 'SEC-F5',
    imageUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: sid_electrohub,
    name: 'ElectroHub Distribution',
    email: 'sales@electrohub.com',
    phone: '+91 9001001001',
    address: 'Tech Plaza, Electronics City, Bengaluru — 560100',
    contactPerson: 'Arun Kumar',
    products: ['ELE-LP-001', 'ELE-TB-003', 'ELE-MN-005'],
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: sid_nextech,
    name: 'NexTech Wholesale',
    email: 'orders@nextech.in',
    phone: '+91 9002002002',
    address: 'Nehru Place Market, New Delhi — 110019',
    contactPerson: 'Priya Mehta',
    products: ['ELE-PH-002', 'ELE-EB-004'],
    createdAt: new Date(Date.now() - 86400000 * 55).toISOString(),
  },
  {
    id: sid_globalfash,
    name: 'Global Fashion Sourcing',
    email: 'orders@globalfashion.com',
    phone: '+91 9003003001',
    address: 'Fashion Boulevard, Bandra West, Mumbai — 400050',
    contactPerson: 'Sarah Khan',
    products: ['FAS-HD-001', 'FAS-SN-003'],
    createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
  },
  {
    id: sid_trendline,
    name: 'TrendLine Apparel',
    email: 'supply@trendline.co.in',
    phone: '+91 9004004001',
    address: 'Apparel Park, Surat Textile Hub, Surat — 395010',
    contactPerson: 'Ramesh Patel',
    products: ['FAS-JN-002', 'FAS-JK-004', 'FAS-TS-005'],
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
];

const DEFAULT_SALES: Sale[] = [
  {
    id: 's-001',
    customerName: 'Rohan Sharma',
    items: [{ productId: pid_laptop, productName: 'Gaming Laptop G15 Pro', quantity: 1, price: 94999, discount: 5000 }],
    tax: 18, discount: 5000, totalAmount: 106198, profit: 22999,
    date: new Date(Date.now() - 86400000 * 1).toISOString(), status: 'completed',
  },
  {
    id: 's-002',
    customerName: 'Ishita Verma',
    items: [
      { productId: pid_hoodie, productName: 'Premium Cotton Hoodie', quantity: 3, price: 2799, discount: 200 },
      { productId: pid_tshirt, productName: 'Graphic Tee — Oversized', quantity: 5, price: 999, discount: 100 },
    ],
    tax: 12, discount: 300, totalAmount: 13285, profit: 6745,
    date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'completed',
  },
  {
    id: 's-003',
    customerName: 'Arjun Singh',
    items: [{ productId: pid_phone, productName: 'Smartphone X12 Ultra', quantity: 2, price: 58999, discount: 2000 }],
    tax: 18, discount: 2000, totalAmount: 134877, profit: 31998,
    date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'completed',
  },
  {
    id: 's-004',
    customerName: 'Neha Gupta',
    items: [
      { productId: pid_jeans, productName: 'Slim Fit Stretch Denim Jeans', quantity: 4, price: 2299, discount: 300 },
      { productId: pid_sneakers, productName: 'Urban Runner Sneakers', quantity: 2, price: 4999, discount: 500 },
    ],
    tax: 12, discount: 800, totalAmount: 18685, profit: 8085,
    date: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'completed',
  },
  {
    id: 's-005',
    customerName: 'Vikram Nair',
    items: [{ productId: pid_earbuds, productName: 'ANC Earbuds Pro 5', quantity: 6, price: 8499, discount: 1000 }],
    tax: 18, discount: 1000, totalAmount: 57934, profit: 22494,
    date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'completed',
  },
  {
    id: 's-006',
    customerName: 'Priya Joshi',
    items: [{ productId: pid_jacket, productName: 'Puffer Winter Jacket', quantity: 2, price: 7499, discount: 500 }],
    tax: 12, discount: 500, totalAmount: 16297, profit: 6498,
    date: new Date(Date.now() - 86400000 * 6).toISOString(), status: 'completed',
  },
  {
    id: 's-007',
    customerName: 'Kiran Reddy',
    items: [{ productId: pid_monitor, productName: '27" 4K Gaming Monitor', quantity: 1, price: 27999, discount: 1000 }],
    tax: 18, discount: 1000, totalAmount: 31938, profit: 9499,
    date: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'pending',
  },
  {
    id: 's-008',
    customerName: 'Meera Iyer',
    items: [{ productId: pid_tablet, productName: 'ProTab 11" AMOLED', quantity: 1, price: 39999, discount: 2000 }],
    tax: 18, discount: 2000, totalAmount: 44878, profit: 11999,
    date: new Date(Date.now() - 86400000 * 8).toISOString(), status: 'completed',
  },
];

const DEFAULT_MOVEMENTS: StockMovement[] = [
  { id: 'sm-001', productId: pid_laptop,   productName: 'Gaming Laptop G15 Pro',         type: 'stock_in',  quantity: 10, note: 'Initial restocking batch',         date: new Date(Date.now() - 86400000 * 25).toISOString() },
  { id: 'sm-002', productId: pid_phone,    productName: 'Smartphone X12 Ultra',           type: 'stock_in',  quantity: 30, note: 'New season stock arrival',          date: new Date(Date.now() - 86400000 * 22).toISOString() },
  { id: 'sm-003', productId: pid_hoodie,   productName: 'Premium Cotton Hoodie',          type: 'stock_in',  quantity: 80, note: 'Winter collection inbound',         date: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: 'sm-004', productId: pid_earbuds,  productName: 'ANC Earbuds Pro 5',              type: 'stock_in',  quantity: 60, note: 'Bulk purchase discount order',      date: new Date(Date.now() - 86400000 * 18).toISOString() },
  { id: 'sm-005', productId: pid_jeans,    productName: 'Slim Fit Stretch Denim Jeans',   type: 'stock_in',  quantity: 100, note: 'Seasonal denim stock',            date: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: 'sm-006', productId: pid_monitor,  productName: '27" 4K Gaming Monitor',          type: 'stock_in',  quantity: 10, note: 'Monitor batch B purchase',          date: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: 'sm-007', productId: pid_jacket,   productName: 'Puffer Winter Jacket',           type: 'stock_in',  quantity: 45, note: 'Winter jacket order — full qty',    date: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'sm-008', productId: pid_tshirt,   productName: 'Graphic Tee — Oversized',        type: 'stock_in',  quantity: 150, note: 'Summer collection inbound',        date: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: 'sm-009', productId: pid_phone,    productName: 'Smartphone X12 Ultra',           type: 'stock_out', quantity: 2,  note: 'Sale order S-003',                   date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'sm-010', productId: pid_tablet,   productName: 'ProTab 11" AMOLED',              type: 'damaged',   quantity: 1,  note: 'Screen crack damage in transit',     date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'sm-011', productId: pid_sneakers, productName: 'Urban Runner Sneakers',          type: 'return',    quantity: 1,  note: 'Customer return — wrong size',       date: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const DEFAULT_PURCHASES: Purchase[] = [
  {
    id: 'pur-001',
    supplierId: sid_electrohub,
    supplierName: 'ElectroHub Distribution',
    items: [
      { productId: pid_laptop,   productName: 'Gaming Laptop G15 Pro',  quantity: 10, price: 72000 },
      { productId: pid_monitor,  productName: '27" 4K Gaming Monitor',  quantity: 10, price: 18500 },
    ],
    totalAmount: 905000,
    date: new Date(Date.now() - 86400000 * 25).toISOString(),
    status: 'received',
  },
  {
    id: 'pur-002',
    supplierId: sid_nextech,
    supplierName: 'NexTech Wholesale',
    items: [
      { productId: pid_phone,   productName: 'Smartphone X12 Ultra',  quantity: 30, price: 42000 },
      { productId: pid_earbuds, productName: 'ANC Earbuds Pro 5',      quantity: 60, price: 4500 },
    ],
    totalAmount: 1530000,
    date: new Date(Date.now() - 86400000 * 22).toISOString(),
    status: 'received',
  },
  {
    id: 'pur-003',
    supplierId: sid_electrohub,
    supplierName: 'ElectroHub Distribution',
    items: [
      { productId: pid_tablet, productName: 'ProTab 11" AMOLED', quantity: 5, price: 28000 },
    ],
    totalAmount: 140000,
    date: new Date(Date.now() - 86400000 * 20).toISOString(),
    status: 'received',
  },
  {
    id: 'pur-004',
    supplierId: sid_globalfash,
    supplierName: 'Global Fashion Sourcing',
    items: [
      { productId: pid_hoodie,   productName: 'Premium Cotton Hoodie', quantity: 80, price: 1200 },
      { productId: pid_sneakers, productName: 'Urban Runner Sneakers', quantity: 20, price: 2200 },
    ],
    totalAmount: 140000,
    date: new Date(Date.now() - 86400000 * 18).toISOString(),
    status: 'received',
  },
  {
    id: 'pur-005',
    supplierId: sid_trendline,
    supplierName: 'TrendLine Apparel',
    items: [
      { productId: pid_jeans,   productName: 'Slim Fit Stretch Denim Jeans', quantity: 100, price: 900 },
      { productId: pid_jacket,  productName: 'Puffer Winter Jacket',          quantity: 45,  price: 3500 },
      { productId: pid_tshirt,  productName: 'Graphic Tee — Oversized',       quantity: 150, price: 380 },
    ],
    totalAmount: 304500,
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    status: 'received',
  },
  {
    id: 'pur-006',
    supplierId: sid_nextech,
    supplierName: 'NexTech Wholesale',
    items: [
      { productId: pid_earbuds, productName: 'ANC Earbuds Pro 5', quantity: 20, price: 4500 },
    ],
    totalAmount: 90000,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'pending',
  },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 'notif-001', type: 'low_stock', title: 'Low Stock Alert', message: 'ProTab 11" AMOLED has only 3 units left (threshold: 4)', date: new Date().toISOString(), read: false },
  { id: 'notif-002', type: 'low_stock', title: 'Low Stock Alert', message: 'Urban Runner Sneakers has only 6 units left (threshold: 8)', date: new Date().toISOString(), read: false },
  { id: 'notif-003', type: 'info', title: 'Pending Purchase Order', message: 'Purchase from NexTech Wholesale (₹90,000) is awaiting confirmation', date: new Date().toISOString(), read: false },
  { id: 'notif-004', type: 'large_sale', title: 'High Value Sale', message: 'Arjun Singh placed an order worth ₹1,34,877', date: new Date(Date.now() - 86400000 * 3).toISOString(), read: true },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const getDefaultState = () => ({
  products: DEFAULT_PRODUCTS,
  suppliers: DEFAULT_SUPPLIERS,
  stockMovements: DEFAULT_MOVEMENTS,
  sales: DEFAULT_SALES,
  purchases: DEFAULT_PURCHASES,
  notifications: DEFAULT_NOTIFICATIONS,
  _initialized: true,
});

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),

      addProduct: (product) => set((state) => {
        const newProduct = { ...product, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        const notifications = [...state.notifications];
        if (product.quantity <= product.minStockThreshold) {
          notifications.push({ id: uuidv4(), type: 'low_stock', title: 'Low Stock Alert', message: `${product.name} added with low stock (${product.quantity} units)`, date: new Date().toISOString(), read: false });
        }
        return { products: [newProduct, ...state.products], notifications };
      }),

      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct, updatedAt: new Date().toISOString() } : p),
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id),
      })),

      addSupplier: (supplier) => set((state) => ({
        suppliers: [{ ...supplier, id: uuidv4(), createdAt: new Date().toISOString() }, ...state.suppliers],
      })),

      updateSupplier: (id, updatedSupplier) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s),
      })),

      deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(s => s.id !== id),
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
        notifications: [{ ...notification, id: uuidv4() }, ...state.notifications],
      })),

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      })),

      clearNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),

      resetToDefaults: () => set(getDefaultState()),
    }),
    {
      name: 'stocksense-inventory-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
