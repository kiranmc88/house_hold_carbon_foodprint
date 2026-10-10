import React from 'react';

/**
 * Reusable Card component with clean environmental styling, subtle shadows, and borders.
 */
export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  bordered = true,
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover
    ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'
    : 'shadow-xs';

  const borderClasses = bordered
    ? 'border border-slate-200/80'
    : '';

  return (
    <div
      className={`bg-white rounded-2xl ${borderClasses} ${hoverClasses} ${paddingClasses[padding] || paddingClasses.md} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
