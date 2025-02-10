// const { create } = require("zustand");
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

const store = (set, get) => ({
  userType: null,
  token: null,
  userId: null,
  email: null,
  phone: null,
  employeeId: null,
  username: null,
  isAuth: false,

  setLogIn: ({ userId, email, phone, userType, token, employeeId, username }) =>
    set(state => {
      state.isAuth = true;
      state.userId = userId;
      state.email = email;
      state.phone = phone;
      state.userType = userType;
      state.token - token;
      state.employeeId = employeeId;
      state.username = username;
    }),

  setLogout: () =>
    set(state => {
      state.isAuth = false;
      state.userId = null;
      state.email = null;
      state.phone = null;
      state.userType = null;
      state.token - null;
      state.employeeId = null;
      state.username = null;
    }),

  setUsername: payload =>
    set(state => {
      state.username = payload;
    }),

  setUserType: userType =>
    set(state => {
      state.userType = userType;
    }),
});

export const useAuthStore = create()(
  persist(immer(store), {
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState,
    }),
  }),
  {
    name: "authStore",
    getStorage: () => createJSONStorage(() => sessionStorage),
  }
);
