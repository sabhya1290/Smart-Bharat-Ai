import React from 'react';

const Card = ({ children, className = '', as: Component = 'div', ...props }) => (
  <Component
    className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export default Card;
