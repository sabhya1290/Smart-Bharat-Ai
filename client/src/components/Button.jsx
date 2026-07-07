import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-brand-blue-600 text-white hover:bg-brand-blue-700 focus-visible:ring-brand-blue-500',
  secondary:
    'bg-white text-brand-blue-700 border border-brand-blue-200 hover:bg-brand-blue-50 focus-visible:ring-brand-blue-400',
  saffron: 'bg-brand-saffron-500 text-white hover:bg-brand-saffron-600 focus-visible:ring-brand-saffron-400',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = React.forwardRef(
  ({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
