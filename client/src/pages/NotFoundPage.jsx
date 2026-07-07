import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/Button.jsx';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <div className="w-16 h-16 rounded-full bg-brand-blue-50 flex items-center justify-center mb-5">
      <Compass size={30} className="text-brand-blue-600" />
    </div>
    <h1 className="text-3xl font-bold text-gray-900">404 — Page Not Found</h1>
    <p className="text-gray-600 mt-2 max-w-sm">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link to="/" className="mt-6">
      <Button variant="primary">Back to Home</Button>
    </Link>
  </div>
);

export default NotFoundPage;
