import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Info } from 'lucide-react';
import { fetchDashboardSummary } from '../services/dashboardApi.js';
import { useToast } from '../context/ToastContext.jsx';
import { formatCategoryLabel } from '../utils/formatters.js';
import Card from '../components/Card.jsx';
import { Skeleton } from '../components/Skeleton.jsx';

const COLORS = ['#265ff0', '#f7801a', '#1eb161', '#4d84ff', '#ffb85e', '#75e3a3', '#153a9e', '#8f3f12'];

const StatCard = ({ label, value }) => (
  <Card className="p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </Card>
);

const TransparencyDashboardPage = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary()
      .then((res) => setData(res.data))
      .catch(() => showToast('Could not load dashboard data.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!data) return null;

  const categoryData = data.categoryBreakdown.map((c) => ({ ...c, category: formatCategoryLabel(c.category) }));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Transparency Dashboard</h1>
        {data.isDemoData && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-saffron-50 text-brand-saffron-700 px-3 py-1.5 rounded-full">
            <Info size={13} /> Demo transparency data
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Total Complaints" value={data.totals.total} />
        <StatCard label="Pending" value={data.totals.pending} />
        <StatCard label="Resolved" value={data.totals.resolved} />
        <StatCard label="Avg. Resolution (days)" value={data.totals.avgResolutionDays} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#265ff0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="count" nameKey="category" outerRadius={90} label>
                {categoryData.map((entry, i) => (
                  <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1eb161" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">State-wise Issues</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.stateBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="state" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#f7801a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default TransparencyDashboardPage;
