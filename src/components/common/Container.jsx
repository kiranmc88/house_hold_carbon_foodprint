import React from 'react';

/**
 * Responsive content container component
 */
export default function Container({ children, className = '', size = 'default' }) {
  const sizeClasses = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size] || sizeClasses.default} ${className}`}>
      {children}
    </div>
  );
}
