'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function MobileMenuToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        ☰
      </Button>

      {open && (
        <>
          {/* Overlay ด้านหลัง sidebar */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-screen w-[80%] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-lg border-l dark:border-gray-700 z-50 flex flex-col gap-4 animate-slide-in">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-lg font-semibold rounded hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200"
            >
              HOME
            </Link>
            <Link
              href="/product"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-lg font-semibold rounded hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200"
            >
              PRODUCT
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-lg font-semibold rounded hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200"
            >
              DASHBOARD
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
