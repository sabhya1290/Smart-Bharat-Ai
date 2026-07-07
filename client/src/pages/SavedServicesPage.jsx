import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, BookmarkX } from 'lucide-react';
import { fetchBookmarkedServices, removeBookmark } from '../services/servicesApi.js';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';

const SavedServicesPage = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchBookmarkedServices()
      .then((res) => setServices(res.data))
      .catch(() => showToast('Could not load saved services.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = async (id) => {
    try {
      await removeBookmark(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast('Removed from saved services.', 'info');
    } catch (err) {
      showToast(err.message || 'Could not remove bookmark.', 'error');
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Saved Services</h1>
      <p className="text-gray-600 mt-1">Government services you've bookmarked for quick access.</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : services.length === 0 ? (
          <div className="sm:col-span-2">
            <Card>
              <EmptyState
                icon={Bookmark}
                title="No saved services yet"
                description="Bookmark services from the Service Finder to see them here."
                action={
                  <Link to="/services">
                    <Button>Browse Services</Button>
                  </Link>
                }
              />
            </Card>
          </div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="p-5">
              <span className="text-xs font-semibold text-brand-blue-600 uppercase tracking-wide">
                {service.category}
              </span>
              <h3 className="font-semibold text-gray-900 mt-1">{service.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
              <div className="flex items-center gap-3 mt-4">
                <Link to={`/services/${service.id}`} className="text-sm font-medium text-brand-blue-600 hover:underline">
                  View Details
                </Link>
                <a href={service.officialUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700">
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => handleRemove(service.id)}
                  className="ml-auto text-gray-400 hover:text-red-600"
                  aria-label={`Remove ${service.name} from saved services`}
                >
                  <BookmarkX size={18} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedServicesPage;
