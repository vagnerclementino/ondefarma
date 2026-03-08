import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PageSkeleton: React.FC = () => {
  return (
    <div className="page-shell" aria-hidden="true">
      <header className="site-header">
        <div className="app-container site-header-inner">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full bg-white/35" />
            <Skeleton className="h-6 w-44 bg-white/35" />
          </div>
          <div className="header-actions">
            <Skeleton className="h-9 w-24 bg-white/35" />
            <Skeleton className="h-9 w-28 bg-white/35" />
          </div>
        </div>
      </header>

      <main className="app-container page-content">
        <section className="surface-card filter-panel mb-4 p-4 sm:p-5">
          <div className="form-grid">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </section>

        <div className="grid-cards">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="surface-card p-4">
              <Skeleton className="mb-3 h-6 w-4/5" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-11/12" />
              <Skeleton className="mb-2 h-4 w-2/3" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="site-footer">
        <div className="app-container site-footer-inner">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-44" />
        </div>
      </footer>
    </div>
  );
};

export default PageSkeleton;
