import { useEffect } from 'react';
import { useScrollStore } from '../store/useScrollStore';

// export function useScrollRestore(isReady) {
//   const scrollY = useScrollStore(s => s.scrollY);
//   const setScrollY = useScrollStore(s => s.setScrollY);
//   const hasRestoredScroll = useScrollStore(s => s.hasRestoredScroll);
//   const setHasRestoredScroll = useScrollStore(s => s.setHasRestoredScroll);

//   useEffect(() => {
//     const handleScroll = () =>
//       requestAnimationFrame(() => setScrollY(window.scrollY));

//     window.addEventListener('scroll', handleScroll, { passive: true });

//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [setScrollY]);

//   useEffect(() => {
//     if (!isReady || hasRestoredScroll || scrollY <= 0) return;

//     const container = document.documentElement;
//     let lastHeight = container.scrollHeight;

//     let timeout = null;
//     let observer = new ResizeObserver(() => {
//       const newHeight = container.scrollHeight;

//       // If height stopped changing for a bit → restore scroll
//       if (newHeight === lastHeight) {
//         if (timeout) clearTimeout(timeout);
//         timeout = setTimeout(() => {
//           // ✅ Only restore if enough content exists
//           if (newHeight > scrollY) {
//             window.scrollTo({ top: scrollY, behavior: 'auto' });
//             setHasRestoredScroll(true);
//             observer.disconnect();
//           }
//         }, 120);
//       } else {
//         lastHeight = newHeight;
//       }
//     });

//     // Start observing DOM height changes
//     observer.observe(container);

//     return () => {
//       if (timeout) clearTimeout(timeout);
//       observer.disconnect();
//     };
//   }, [isReady, scrollY, hasRestoredScroll, setHasRestoredScroll]);

//   // Reset state when unmounting / navigating away
//   useEffect(() => {
//     return () => setHasRestoredScroll(false);
//   }, [setHasRestoredScroll]);
// }

export function useScrollRestore(isReady) {
  const scrollY = useScrollStore(s => s.scrollY);
  const setScrollY = useScrollStore(s => s.setScrollY);
  const hasRestoredScroll = useScrollStore(s => s.hasRestoredScroll);
  const setHasRestoredScroll = useScrollStore(s => s.setHasRestoredScroll);

  useEffect(() => {
    const handleScroll = () =>
      requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollY]);

  useEffect(() => {
    if (!isReady || hasRestoredScroll || scrollY <= 0) return;

    let lastHeight = 0;
    let stableTimer = null;

    const checkStable = () => {
      const currentHeight = document.documentElement.scrollHeight;

      if (currentHeight === lastHeight && currentHeight > scrollY) {
        window.scrollTo({ top: scrollY, behavior: 'auto' });
        setHasRestoredScroll(true);
      } else {
        lastHeight = currentHeight;
        stableTimer = setTimeout(checkStable, 150);
      }
    };

    stableTimer = setTimeout(checkStable, 150);

    return () => clearTimeout(stableTimer);
  }, [isReady, scrollY, hasRestoredScroll, setHasRestoredScroll]);

  useEffect(() => {
    return () => setHasRestoredScroll(false);
  }, [setHasRestoredScroll]);
}
