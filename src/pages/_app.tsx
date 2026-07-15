import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { PageSkeleton } from '@/components/organisms';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (fadeInFrameRef.current !== null) {
        cancelAnimationFrame(fadeInFrameRef.current);
        fadeInFrameRef.current = null;
      }
    };

    const handleStart = () => {
      clearTimers();
      setShowSkeleton(true);
      fadeInFrameRef.current = requestAnimationFrame(() => {
        setIsSkeletonVisible(true);
        fadeInFrameRef.current = null;
      });
    };

    const handleComplete = () => {
      setIsSkeletonVisible(false);
      hideTimeoutRef.current = setTimeout(() => {
        setShowSkeleton(false);
      }, 220);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      clearTimers();
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  return (
    <>
      <Component {...pageProps} />
      {showSkeleton && (
        <div className={`route-skeleton-overlay ${isSkeletonVisible ? 'is-visible' : ''}`}>
          <PageSkeleton />
        </div>
      )}
    </>
  );
}
