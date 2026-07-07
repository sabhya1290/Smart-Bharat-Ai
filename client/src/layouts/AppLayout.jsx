import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Landmark, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import AccessibilityControls from '../components/AccessibilityControls.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-600"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-blue-600 flex items-center justify-center">
                <Landmark size={18} className="text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-gray-900 hidden sm:inline">Smart Bharat AI</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <AccessibilityControls className="hidden md:flex" />
            <LanguageSelector />
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 px-2 py-1.5"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-57px)]">
          <Sidebar />
        </aside>

        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileOpen(false)}>
            <aside
              className="w-72 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <main id="main-content" className="flex-1 min-w-0 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
