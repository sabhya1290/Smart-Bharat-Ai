import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';

const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-blue-50 to-white px-4 py-10">
    <div className="w-full max-w-md">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-blue-600 flex items-center justify-center">
          <Landmark size={22} className="text-white" aria-hidden="true" />
        </div>
        <span className="text-xl font-bold text-gray-900">Smart Bharat AI</span>
      </Link>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
