import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight } from 'lucide-react';
import { fetchServices } from '../services/servicesApi.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ServiceFinderPage = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category))].sort(),
    [services]
  );

  useEffect(() => {
    setLoading(true);
    fetchServices({ search: debouncedSearch || undefined, category: category || undefined })
      .then((res) => setServices(res.data))
      .catch(() => showToast('Could not load services.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">Government Service Finder</h1>
      <p className="text-gray-600 mt-1">Search and explore government services available to you.</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services (e.g. Aadhaar, PAN, ration card)..."
            aria-label="Search services"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : services.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState icon={Search} title="No services found" description="Try a different search term or category." />
          </div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="p-5 flex flex-col">
              <span className="text-xs font-semibold text-brand-blue-600 uppercase tracking-wide">
                {service.category}
              </span>
              <h3 className="font-semibold text-gray-900 mt-1">{service.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between mt-4">
                <Link
                  to={`/services/${service.id}`}
                  className="text-sm font-medium text-brand-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  View Details <ArrowRight size={14} />
                </Link>
                <a
                  href={service.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open official portal for ${service.name}`}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceFinderPage;
