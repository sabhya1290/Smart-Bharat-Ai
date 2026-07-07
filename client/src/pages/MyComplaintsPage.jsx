import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight } from 'lucide-react';
import { fetchMyIssues } from '../services/issuesApi.js';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate, formatCategoryLabel } from '../utils/formatters.js';
import { STATUS_COLORS } from '../data/constants.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';
import Button from '../components/Button.jsx';

const MyComplaintsPage = () => {
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues()
      .then((res) => setIssues(res.data))
      .catch(() => showToast('Could not load your complaints.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
      <p className="text-gray-600 mt-1">All civic issues you've reported.</p>

      <div className="space-y-4 mt-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : issues.length === 0 ? (
          <Card>
            <EmptyState
              icon={ClipboardList}
              title="No complaints yet"
              description="You haven't reported any civic issues. Report one to start tracking it here."
              action={
                <Link to="/report-issue">
                  <Button>Report an Issue</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          issues.map((issue) => (
            <Card key={issue.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">{issue.complaintId}</p>
                  <h3 className="font-semibold text-gray-900 mt-0.5">{formatCategoryLabel(issue.category)}</h3>
                </div>
                <Badge className={STATUS_COLORS[issue.status]}>{issue.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{issue.description}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {issue.city}, {issue.state} · Submitted {formatDate(issue.createdAt)}
                </p>
                <Link
                  to={`/complaint-tracker?id=${issue.complaintId}`}
                  className="text-sm font-medium text-brand-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Track <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyComplaintsPage;
