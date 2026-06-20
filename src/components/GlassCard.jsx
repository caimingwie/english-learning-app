import React from 'react';

/**
 * Reusable glassmorphism card wrapper.
 *
 * Props:
 *  - children:    card content
 *  - className:   additional class names
 *  - onClick:     optional click handler
 *  - as:          HTML element to render (default: 'div')
 *  - padding:     override padding (default: uses .glass-card CSS)
 *  - style:       inline styles
 */
export default function GlassCard({
  children,
  className = '',
  onClick,
  as: Tag = 'div',
  padding,
  style,
  ...rest
}) {
  const baseClass = 'glass-card';
  const combinedClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <Tag
      className={combinedClass}
      onClick={onClick}
      style={padding !== undefined ? { ...style, padding } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
