import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, Sparkles, FileWarning, ArrowRight } from 'lucide-react';
import Card from '../components/Card.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const QUICK_LINKS = [
  { to: '/assistant', icon: MessageCircle, title: 'Ask the AI Assistant', description: 'Get instant guidance on any government service.' },
  { to: '/services', icon: Search, title: 'Find a Service', description: 'Search 15+ government services by category or state.' },
  { to: '/recommendations', icon: Sparkles, title: 'View Recommendations', description: 'See schemes matched to your profile.' },
  { to: '/report-issue', icon: FileWarning, title: 'Report a Civic Issue', description: 'Report and track problems in your area.' },
];

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋
      </h1>
      <p className="text-gray-600 mt-1">Here's what you can do with Smart Bharat AI today.</p>

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        {QUICK_LINKS.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to}>
            <Card className="p-5 h-full hover:shadow-md hover:border-brand-blue-200 transition-all">
              <div className="w-10 h-10 rounded-lg bg-brand-blue-50 flex items-center justify-center mb-3">
                <Icon size={20} className="text-brand-blue-600" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 p-5 bg-brand-blue-50 border-brand-blue-100">
        <h3 className="font-semibold text-brand-blue-900">Complete your profile</h3>
        <p className="text-sm text-brand-blue-800 mt-1">
          Add your state, occupation, and income range in Profile & Settings to unlock personalized
          scheme recommendations.
        </p>
        <Link to="/profile" className="inline-block mt-3 text-sm font-medium text-brand-blue-700 hover:underline">
          Go to Profile →
        </Link>
      </Card>
    </div>
  );
};

export default DashboardPage;
