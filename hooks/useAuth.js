import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { isAuth, userId, token, email, phone, username, userType, setLogout } =
    useAuthStore();

  return {
    isAuth,
    userId,
    token,
    email,
    phone,
    username,
    userType,
    logout: setLogout,
  };
};
