import React from 'react';

/**
 * Reusable Badge / Tag component
 */
export default function Badge({
  children,
  variant = 'emerald',
  size = 'md',
  icon: Icon,
  className = '',
}) {
  const variantClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide uppercase',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantClasses[variant] || variantClasses.emerald} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
