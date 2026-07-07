import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Building2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { fetchIssueByComplaintId } from '../services/issuesApi.js';
import { formatDate, formatCategoryLabel } from '../utils/formatters.js';
import { COMPLAINT_STATUSES, STATUS_COLORS } from '../data/constants.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';

const ComplaintTrackerPage = () => {
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || '');
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSearch = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setIssue(null);
    try {
      const res = await fetchIssueByComplaintId(id.trim());
      setIssue(res.data);
    } catch (err) {
      setError(err.message || 'Complaint not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('id')) runSearch(searchParams.get('id'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Complaint Tracker</h1>
      <p className="text-gray-600 mt-1">Enter your complaint ID to check its status.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(complaintId);
        }}
        className="flex gap-2 mt-6"
      >
        <input
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          placeholder="e.g. SB-2026-1001"
          aria-label="Complaint ID"
          className="flex-1 px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
        />
        <Button type="submit" loading={loading}>
          <Search size={16} /> Track
        </Button>
      </form>

      {error && (
        <Card className="mt-6">
          <EmptyState icon={Search} title="Complaint not found" description={error} />
        </Card>
      )}

      {issue && (
        <Card className="p-6 mt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Complaint ID</p>
              <p className="text-xl font-bold text-brand-blue-700">{issue.complaintId}</p>
            </div>
            <Badge className={STATUS_COLORS[issue.status]}>{issue.status}</Badge>
          </div>

          <p className="text-gray-700 mt-4">{issue.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Location</p>
                <p className="text-gray-800">{issue.address}, {issue.city}, {issue.state} - {issue.pincode}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Department</p>
                <p className="text-gray-800">{issue.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Submitted</p>
                <p className="text-gray-800">{formatDate(issue.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Estimated Resolution</p>
                <p className="text-gray-800">{formatDate(issue.estimatedResolutionDate)}</p>
              </div>
            </div>
          </div>

          {issue.imageUrl && (
            <img
              src={issue.imageUrl}
              alt="Reported civic issue"
              className="mt-5 rounded-lg border border-gray-200 max-h-64 object-cover"
            />
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Progress Timeline</h3>
            <ol className="space-y-3">
              {COMPLAINT_STATUSES.map((status) => {
                const reached = issue.timeline.some((t) => t.status === status);
                const entry = issue.timeline.find((t) => t.status === status);
                return (
                  <li key={status} className="flex items-start gap-3">
                    {reached ? (
                      <CheckCircle2 size={18} className="text-brand-green-600 mt-0.5 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-gray-300 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${reached ? 'text-gray-900' : 'text-gray-400'}`}>
                        {status}
                      </p>
                      {entry && (
                        <p className="text-xs text-gray-500">
                          {entry.note} · {formatDate(entry.createdAt)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="text-xs text-gray-400 mt-5">
            Category: {formatCategoryLabel(issue.category)} · Priority: {issue.priority}
          </p>
        </Card>
      )}
    </div>
  );
};

export default ComplaintTrackerPage;
