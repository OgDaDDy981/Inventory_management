'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/Products';
import Inventory from '@/components/Inventory';
import ExpiryManager from '@/components/ExpiryManager';
import Sales from '@/components/Sales';
import Purchases from '@/components/Purchases';
import Suppliers from '@/components/Suppliers';
import Analytics from '@/components/Analytics';
import Reports from '@/components/Reports';

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.15 } },
};

const pages: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  products: Products,
  inventory: Inventory,
  expiry: ExpiryManager,
  sales: Sales,
  purchases: Purchases,
  suppliers: Suppliers,
  analytics: Analytics,
  reports: Reports,
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  const PageComponent = pages[currentPage] || Dashboard;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712' }}>
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} setCurrentPage={(page) => { setCurrentPage(page); }} />

      {/* Main content area */}
      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ flex: 1, minWidth: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top bar */}
        <Topbar currentPage={currentPage} sidebarWidth={sidebarWidth} />

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: '90px 24px 32px',
          maxWidth: '100%',
          overflow: 'hidden',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}
