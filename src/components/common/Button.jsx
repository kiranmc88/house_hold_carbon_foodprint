import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Button component supporting button and Link variants.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus:ring-emerald-500 border border-emerald-600',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 border border-slate-200/80',
    outline: 'bg-transparent hover:bg-emerald-50 text-emerald-700 border border-emerald-600/30 hover:border-emerald-600 focus:ring-emerald-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-700',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`;

  const iconElement = Icon ? (
    <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
  ) : null;

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  if (to) {
    return (
      <Link
        to={disabled ? '#' : to}
        onClick={handleClick}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={combinedClasses}
        {...props}
      >
        {Icon && iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && iconElement}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        onClick={handleClick}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={combinedClasses}
        {...props}
      >
        {Icon && iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && iconElement}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={combinedClasses}
      {...props}
    >
      {Icon && iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && iconElement}
    </button>
  );
}
