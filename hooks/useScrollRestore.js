import { useEffect } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

export function useScrollRestore(isReady) {
  const scrollY = useScrollStore(state => state.scrollY);
  const setScrollY = useScrollStore(state => state.setScrollY);
  const hasRestoredScroll = useScrollStore(state => state.hasRestoredScroll);
  const setHasRestoredScroll = useScrollStore(
    state => state.setHasRestoredScroll
  );

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollY]);

  useEffect(() => {
    if (!isReady || hasRestoredScroll || scrollY <= 0) return;

    let attempts = 0;

    const tryRestore = () => {
      const docHeight = document.documentElement.scrollHeight;

      if (docHeight > scrollY + window.innerHeight) {
        window.scrollTo({
          top: scrollY,
          behavior: 'smooth',
        });
        setHasRestoredScroll(true);
        return true;
      }
      return false;
    };

    const interval = setInterval(() => {
      const done = tryRestore();
      if (done || attempts > 10) clearInterval(interval);
      attempts++;
    }, 100);

    return () => clearInterval(interval);
  }, [isReady, scrollY, hasRestoredScroll, setHasRestoredScroll]);

  useEffect(() => {
    return () => setHasRestoredScroll(false);
  }, [setHasRestoredScroll]);
}

  // ✅ Enable scroll restore after reload
//   useScrollRestore(isSuccess);