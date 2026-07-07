import React from 'react';

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

export default Badge;
