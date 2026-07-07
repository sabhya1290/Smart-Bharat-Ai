import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, MessageCircle } from 'lucide-react';
import { fetchServiceById, bookmarkService, removeBookmark, fetchBookmarkedServices } from '../services/servicesApi.js';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchServiceById(id), fetchBookmarkedServices()])
      .then(([serviceRes, bookmarksRes]) => {
        setService(serviceRes.data);
        setBookmarked(bookmarksRes.data.some((s) => s.id === id));
      })
      .catch(() => showToast('Could not load this service.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleBookmark = async () => {
    setBookmarking(true);
    try {
      if (bookmarked) {
        await removeBookmark(id);
        setBookmarked(false);
        showToast('Removed from saved services.', 'info');
      } else {
        await bookmarkService(id);
        setBookmarked(true);
        showToast('Saved to your services.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Could not update bookmark.', 'error');
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <CardSkeleton />
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <Card className="p-6">
        <span className="text-xs font-semibold text-brand-blue-600 uppercase tracking-wide">
          {service.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{service.name}</h1>
        <p className="text-gray-600 mt-3">{service.description}</p>

        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Eligibility</h3>
            <p className="text-sm text-gray-600">{service.eligibility}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Processing Time</h3>
            <p className="text-sm text-gray-600">{service.processingTime}</p>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1.5">Required Documents</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {service.requiredDocuments.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Availability: </span>
          {service.nationwide ? 'Available nationwide' : service.states.join(', ')}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <a href={service.officialUrl} target="_blank" rel="noreferrer">
            <Button variant="primary">
              <ExternalLink size={16} /> Visit Official Portal
            </Button>
          </a>
          <Button variant="secondary" onClick={toggleBookmark} loading={bookmarking}>
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {bookmarked ? 'Saved' : 'Save Service'}
          </Button>
          <Link to="/assistant">
            <Button variant="ghost">
              <MessageCircle size={16} /> Ask AI About This Service
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDetailsPage;
