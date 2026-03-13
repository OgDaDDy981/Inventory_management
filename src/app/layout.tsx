import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "StockSense Pro – Inventory Management Platform",
  description: "A modern, AI-powered inventory management solution for businesses. Track products, monitor stock, analyze profitability, and manage suppliers all in one place.",
  keywords: "inventory management, stock tracking, product management, sales analytics, supplier management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="animated-bg grid-bg">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0f172a' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f172a' }
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
