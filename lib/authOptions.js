import CredentialsProvider from 'next-auth/providers/credentials';
import api from './api';

async function authenticate(username, otp, password) {
  const url = new URL('/api/auth/signin', process.env.BACKEND_BASE_URL);
  const { data } = await api.post(url.href, { username, otp, password });

  if (!data || data.error) throw new Error(data?.message || 'Login failed');

  return {
    success: true,
    result: {
      id: data.id,
      name: data.name,
      email: data.email,
      token: data.token,
      expiresIn: data.expiresIn,
      phone: data.phone,
      username: data.username,
      userType: data.userType,
    },
  };
}

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 604800 seconds (7 days)
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
        password: { label: 'Password', type: 'text' },
      },
      async authorize(credentials) {
        const { username, otp, password } = credentials ?? {};
        const authResp = await authenticate(username, otp, password);
        if (!authResp.success) return null;
        return authResp.result;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.expiresIn = user.expiresIn;
        token.expiresAt = Date.now() + user.expiresIn * 1000;
        token.phone = user.phone;
        token.username = user.username;
        token.userType = user.userType;
      }
      if (Date.now() > (token.expiresAt ?? 0)) {
        return {};
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        accessToken: token.accessToken,
        expiresIn: token.expiresIn,
        phone: token.phone,
        username: token.username,
        userType: token.userType,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
