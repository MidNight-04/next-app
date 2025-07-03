import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

const EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const getResetState = () => ({
  userType: null,
  token: null,
  tokenSetAt: null,
  userId: null,
  email: null,
  phone: null,
  employeeId: null,
  username: null,
  isAuth: false,
  isHydrated: false,
});

const store = set => ({
  ...getResetState(),

  setHydrated: () =>
    set(state => {
      state.isHydrated = true;
    }),

  setLogIn: ({ userId, email, phone, userType, token, employeeId, username }) =>
    set(state => {
      const hasChanged =
        state.userId !== userId ||
        state.email !== email ||
        state.phone !== phone ||
        state.userType !== userType ||
        state.token !== token ||
        state.employeeId !== employeeId ||
        state.username !== username;

      if (!hasChanged) return state;

      const now = Date.now();
      state.isAuth = true;
      state.userId = userId;
      state.email = email;
      state.phone = phone;
      state.userType = userType;
      state.token = token;
      state.tokenSetAt = now;
      state.employeeId = employeeId;
      state.username = username;
    }),

  setLogout: () => set(() => getResetState()),

  setUsername: username =>
    set(state => {
      if (state.username !== username) {
        state.username = username;
      }
    }),

  setUserType: userType =>
    set(state => {
      if (state.userType !== userType) {
        state.userType = userType;
      }
    }),

  getToken: () => {
    const { token, tokenSetAt } = useAuthStore.getState();
    const now = Date.now();
    const isExpired = !tokenSetAt || now - tokenSetAt > EXPIRY_DURATION;
    return isExpired ? null : token;
  },
});

export const useAuthStore = create()(
  persist(immer(store), {
    name: 'authStore',
    getStorage: () => createJSONStorage(() => sessionStorage),

    onRehydrateStorage: () => state => {
      if (state?.setHydrated) {
        state.setHydrated();
      }
    },

    merge: (persisted, current) => {
      const now = Date.now();
      const isExpired =
        persisted?.tokenSetAt && now - persisted.tokenSetAt > EXPIRY_DURATION;

      return isExpired
        ? { ...current, ...getResetState() }
        : { ...current, ...persisted };
    },
  })
);
