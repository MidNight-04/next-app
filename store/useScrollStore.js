import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useScrollStore = create(
  persist(
    set => ({
      scrollY: 0,
      hasRestoredScroll: false,

      setScrollY: y => set({ scrollY: y }),
      setHasRestoredScroll: value => set({ hasRestoredScroll: value }),

      resetScroll: () => set({ scrollY: 0, hasRestoredScroll: false }),
    }),
    {
      name: 'scroll-state',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useContainerScrollStore = create(
  persist(
    (set) => ({
      scrollY: 0,
      hasRestoredScroll: false,
      setScrollY: (y) => set({ scrollY: y }),
      setHasRestoredScroll: (value) => set({ hasRestoredScroll: value }),
    }),
    {
      name: 'sidebar-scroll-storage', // localStorage key
      partialize: (state) => ({ scrollY: state.scrollY }), // only persist scrollY
    }
  )
);



