import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useProjectPayementStore = create()(
  persist(
    immer(set => ({
      activeTab: 'overview',
      filters: {},
      currentPage: 1,
      scrollY: 0,
      hasRestoredScroll: false,

      setActiveTab: tab =>
        set(state => {
          state.activeTab = tab;
        }),

      setFilters: filters =>
        set(state => {
          state.filters = filters;
        }),

      setCurrentPage: page =>
        set(state => {
          state.currentPage = page;
        }),

      setScrollY: y =>
        set(state => {
          state.scrollY = y;
        }),

      setHasRestoredScroll: v =>
        set(state => {
          state.hasRestoredScroll = v;
        }),

      resetPageState: () =>
        set(state => {
          state.activeTab = 'overview';
          state.filters = {};
          state.currentPage = 1;
          state.scrollY = 0;
        }),
    })),
    {
      name: 'pageState',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
