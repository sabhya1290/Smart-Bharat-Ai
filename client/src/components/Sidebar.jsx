import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageCircle,
  Search,
  Sparkles,
  FileWarning,
  ListChecks,
  ClipboardList,
  BarChart3,
  Bookmark,
  UserCog,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';
import { STRINGS } from '../data/i18n.js';

const NAV_ITEMS = [
  { to: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { to: '/assistant', key: 'assistant', icon: MessageCircle },
  { to: '/services', key: 'services', icon: Search },
  { to: '/recommendations', key: 'recommendations', icon: Sparkles },
  { to: '/report-issue', key: 'reportIssue', icon: FileWarning },
  { to: '/complaint-tracker', key: 'tracker', icon: ListChecks },
  { to: '/my-complaints', key: 'myComplaints', icon: ClipboardList },
  { to: '/transparency', key: 'transparency', icon: BarChart3 },
  { to: '/saved-services', key: 'saved', icon: Bookmark },
  { to: '/profile', key: 'profile', icon: UserCog },
];

const Sidebar = ({ onNavigate }) => {
  const { language } = useAccessibility();
  const strings = STRINGS[language] || STRINGS.en;

  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-blue-50 text-brand-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Icon size={18} aria-hidden="true" />
          {strings.nav[key]}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
