import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }
      const current = Math.min(Math.max((scrollTop / totalScrollable) * 100, 0), 100);
      setScrollProgress(current);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial calculation
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Portfolio scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-900/10 dark:bg-slate-100/5 pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-[width] duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
