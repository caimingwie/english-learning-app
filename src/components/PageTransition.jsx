import React, { useState, useEffect, useRef } from 'react';

/**
 * Wraps page content with a fade+slide transition when `pageKey` changes.
 *
 * Props:
 *  - children:  page content
 *  - pageKey:   unique key for the current page (e.g., activeTab)
 *  - direction: 'forward' | 'backward' (default: 'forward')
 */
export default function PageTransition({ children, pageKey, direction = 'forward' }) {
  const [active, setActive] = useState(true);
  const [renderedKey, setRenderedKey] = useState(pageKey);
  const prevKey = useRef(pageKey);

  useEffect(() => {
    if (pageKey !== prevKey.current) {
      setActive(false);
      const timer = setTimeout(() => {
        setRenderedKey(pageKey);
        prevKey.current = pageKey;
        setActive(true);
      }, 150); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [pageKey]);

  const animClass = active
    ? 'page-transition--enter'
    : 'page-transition--exit';

  return (
    <div
      key={renderedKey}
      className={`page-transition ${animClass}`}
      style={{ '--transition-direction': direction === 'backward' ? -1 : 1 }}
    >
      {children}
    </div>
  );
}
