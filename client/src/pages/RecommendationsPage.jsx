import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ExternalLink, Bookmark, MessageCircle } from 'lucide-react';
import { fetchRecommendations } from '../services/recommendationsApi.js';
import { bookmarkService } from '../services/servicesApi.js';
import { useToast } from '../context/ToastContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';

const RecommendationsPage = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations()
      .then((res) => setData(res.data))
      .catch(() => showToast('Could not load recommendations.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (serviceId) => {
    try {
      await bookmarkService(serviceId);
      showToast('Saved to your services.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not save service.', 'error');
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Personalized Scheme Recommendations</h1>
      <p className="text-gray-600 mt-1">Based on your profile, here are schemes you may be eligible for.</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.profileComplete ? (
        <Card className="mt-6 p-6">
          <EmptyState
            icon={Sparkles}
            title="Complete your profile for better recommendations"
            description="Add your age group, state, occupation, and category so we can personalize schemes for you."
            action={
              <Link to="/profile">
                <Button>Complete Profile</Button>
              </Link>
            }
          />
        </Card>
      ) : data.recommendations.length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={Sparkles}
            title="No specific matches yet"
            description="We couldn't find schemes matching your current profile. Explore the full Service Finder instead."
            action={
              <Link to="/services">
                <Button variant="secondary">Browse All Services</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {data.recommendations.map((rec, i) => (
            <Card key={i} className="p-5 flex flex-col">
              <span className="text-xs font-semibold text-brand-blue-600 uppercase tracking-wide">
                {rec.service.category}
              </span>
              <h3 className="font-semibold text-gray-900 mt-1">{rec.service.name}</h3>
              <p className="text-sm text-brand-green-700 bg-brand-green-50 rounded-md px-2.5 py-1.5 mt-2">
                {rec.reason}
              </p>
              <p className="text-sm text-gray-500 mt-2">{rec.service.eligibility}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <a href={rec.service.officialUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="secondary">
                    <ExternalLink size={14} /> Portal
                  </Button>
                </a>
                <Button size="sm" variant="ghost" onClick={() => handleSave(rec.service.id)}>
                  <Bookmark size={14} /> Save
                </Button>
                <Link to="/assistant">
                  <Button size="sm" variant="ghost">
                    <MessageCircle size={14} /> Ask AI
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
