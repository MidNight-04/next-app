import { useEffect } from 'react';
import { useContainerScrollStore } from '../store/useScrollStore';

export function useContainerScrollRestore(isReady, containerRef) {
  const scrollY = useContainerScrollStore(s => s.scrollY);
  const setScrollY = useContainerScrollStore(s => s.setScrollY);
  const hasRestoredScroll = useContainerScrollStore(s => s.hasRestoredScroll);
  const setHasRestoredScroll = useContainerScrollStore(
    s => s.setHasRestoredScroll
  );

  // Save scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollY(container.scrollTop);
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => container.removeEventListener('scroll', handleScroll);
  }, [setScrollY, containerRef]);

  // Restore scroll position
  useEffect(() => {
    if (!isReady || hasRestoredScroll) return;

    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = scrollY || 0;
    setHasRestoredScroll(true);
  }, [isReady, hasRestoredScroll, scrollY, containerRef, setHasRestoredScroll]);

  // Reset restore flag on unmount
  useEffect(() => {
    return () => setHasRestoredScroll(false);
  }, [setHasRestoredScroll]);
}
