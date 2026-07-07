import React from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  MessageCircle,
  Search,
  FileWarning,
  BarChart3,
  Sparkles,
  Languages,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'AI Civic Assistant',
    description: 'Ask questions about government services in plain English, Hindi, or Hinglish and get step-by-step guidance.',
  },
  {
    icon: Search,
    title: 'Service Finder',
    description: 'Search and filter 15+ government services with eligibility, documents, and official portal links.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Recommendations',
    description: 'Get scheme suggestions tailored to your age, occupation, income, and state.',
  },
  {
    icon: FileWarning,
    title: 'Report Civic Issues',
    description: 'Report broken streetlights, potholes, and more with photos — get a trackable complaint ID instantly.',
  },
  {
    icon: BarChart3,
    title: 'Transparency Dashboard',
    description: 'See real complaint data — resolution times, categories, and trends across your city and state.',
  },
  {
    icon: Languages,
    title: 'Built for Every Citizen',
    description: 'Multilingual support, high-contrast mode, adjustable font sizes, and full keyboard navigation.',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-blue-600 flex items-center justify-center">
              <Landmark size={20} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Smart Bharat AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-4 pt-16 pb-12">
        <span className="inline-block bg-brand-saffron-50 text-brand-saffron-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          GenAI-Powered Civic Companion
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Government services, made simple for every citizen
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          Ask questions, discover schemes, report civic issues, and track complaints — all in one place,
          in English, Hindi, or Hinglish.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg" variant="primary">
              Create Free Account <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/complaint-tracker">
            <Button size="lg" variant="secondary">
              Track a Complaint
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="w-11 h-11 rounded-lg bg-brand-blue-50 flex items-center justify-center mb-4">
                <Icon size={22} className="text-brand-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        Smart Bharat AI — a civic-tech demo. AI guidance should always be verified through official
        government portals.
      </footer>
    </div>
  );
};

export default LandingPage;
