export const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCategoryLabel = (value) =>
  value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
