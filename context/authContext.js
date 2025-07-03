// 'use client';

// import { createContext, useCallback, useEffect, useState } from 'react';
// import { signOut } from 'next-auth/react';
// import { useAuthStore } from '../store/useAuthStore';

// export const AuthContext = createContext({
//   session: null,
//   token: null,
//   GetServerSession: async () => undefined,
// });

// export const AuthProvider = ({ children }) => {
//   const [session, setSession] = useState(null);
//   const setLogIn = useAuthStore(state => state.setLogIn);
//   const setLogout = useAuthStore(state => state.setLogout);

//   const GetServerSession = useCallback(async () => {
//     try {
//       const response = await fetch('/api/auth/session');
//       const data = await response.json();
//       setSession(data);
//     } catch (error) {
//       console.error('Failed to fetch session:', error);
//       setSession(null);
//       setLogout();
//     }
//   }, [setLogout]);

//   useEffect(() => {
//     GetServerSession();
//     const interval = setInterval(() => {
//       GetServerSession();
//     }, 5 * 60 * 1000);

//     return () => clearInterval(interval);
//   }, [GetServerSession]);

//   useEffect(() => {
//     const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
//     const now = Date.now();
//     const tokenSetAt = useAuthStore.getState().tokenSetAt;
//     if (tokenSetAt && now - tokenSetAt > SEVEN_DAYS_MS) {
//       signOut();
//     }
//   }, []);

//   useEffect(() => {
//     if (!session?.expires) return;
//     const expiresAt = new Date(session.expires).getTime();
//     const now = Date.now();
//     const timeLeft = expiresAt - now;

//     if (timeLeft <= 0) {
//       signOut();
//       return;
//     }

//     const timer = setTimeout(() => {
//       signOut();
//     }, timeLeft);

//     return () => clearTimeout(timer);
//   }, [session?.expires]);

//   useEffect(() => {
//     const user = session?.user;
//     if (user?.accessToken) {
//       setLogIn({
//         token: user.accessToken,
//         tokenSetAt: Date.now(),
//         userId: user.id,
//         email: user.email ?? null,
//         phone: user.phone ?? null,
//         userType: user.userType ?? null,
//         employeeId: user.employeeId ?? null,
//         username: user.username ?? null,
//       });
//     } else {
//       setLogout();
//     }
//   }, [session, setLogIn, setLogout]);

//   // useEffect(() => {
//   //   const tokenSetAt = useAuthStore.getState().tokenSetAt;
//   //   const EXPIRY_DURATION = 15 * 60 * 1000; // 15 minutes

//   //   if (!tokenSetAt) return;

//   //   const now = Date.now();
//   //   const timeLeft = EXPIRY_DURATION - (now - tokenSetAt);

//   //   if (timeLeft <= 0) {
//   //     signOut();
//   //     setLogout();
//   //     return;
//   //   }

//   //   const timer = setTimeout(() => {
//   //     signOut();
//   //     setLogout();
//   //   }, timeLeft);

//   //   return () => clearTimeout(timer);
//   // }, [session]);

//   useEffect(() => {
//     const EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 Days
//     const tokenSetAt = useAuthStore.getState().tokenSetAt;

//     if (!tokenSetAt) return;

//     const now = Date.now();
//     const elapsed = now - tokenSetAt;
//     const timeLeft = EXPIRY_DURATION - elapsed;

//     if (timeLeft <= 0) {
//       setLogout();
//       signOut();
//       return;
//     }

//     const timer = setTimeout(() => {
//       setLogout();
//       signOut();
//     }, timeLeft);

//     return () => clearTimeout(timer);
//   }, [session]);

//   return (
//     <AuthContext.Provider
//       value={{
//         session: session?.user ?? null,
//         token: session?.user?.accessToken ?? null,
//         GetServerSession,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';

export const AuthContext = createContext({
  session: null,
  token: null,
  GetServerSession: async () => undefined,
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const setLogIn = useAuthStore(state => state.setLogIn);
  const setLogout = useAuthStore(state => state.setLogout);

  const GetServerSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setSession(data);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setSession(null);
      setLogout();
    }
  }, [setLogout]);

  useEffect(() => {
    GetServerSession();
    const interval = setInterval(() => {
      GetServerSession();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [GetServerSession]);

  useEffect(() => {
    const user = session?.user;
    if (user?.accessToken) {
      setLogIn({
        token: user.accessToken,
        tokenSetAt: Date.now(),
        userId: user.id,
        email: user.email ?? null,
        phone: user.phone ?? null,
        userType: user.userType ?? null,
        employeeId: user.employeeId ?? null,
        username: user.username ?? null,
      });
    } else {
      setLogout();
    }
  }, [session, setLogIn, setLogout]);

  useEffect(() => {
    if (!session?.expires) return;

    const expiresAt = new Date(session.expires).getTime();
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 0) {
      signOut();
      return;
    }

    const timer = setTimeout(() => {
      signOut();
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [session?.expires]);

  useEffect(() => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const tokenSetAt = useAuthStore.getState().tokenSetAt;

    if (!tokenSetAt) return;

    const now = Date.now();
    const timeLeft = SEVEN_DAYS_MS - (now - tokenSetAt);

    if (timeLeft <= 0) {
      setLogout();
      signOut();
      return;
    }

    const warningTime = timeLeft - 60 * 1000;

    let warningTimer = null;
    let logoutTimer = null;

    if (warningTime > 0) {
      warningTimer = setTimeout(() => {
        toast.warning('You will be logged out in 1 minute');
      }, warningTime);
    }

    logoutTimer = setTimeout(() => {
      setLogout();
      signOut();
    }, timeLeft);

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session: session?.user ?? null,
        token: session?.user?.accessToken ?? null,
        GetServerSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
