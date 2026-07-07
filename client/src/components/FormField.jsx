import React from 'react';

const FormField = ({ label, htmlFor, error, children, hint }) => (
  <div className="mb-4">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
    {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    {error && (
      <p className="mt-1 text-xs text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

export const inputClasses = (hasError) =>
  `w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400
   focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent
   ${hasError ? 'border-red-400' : 'border-gray-300'}`;

export default FormField;
