import { Geist, Geist_Mono, Imprima, Ubuntu } from 'next/font/google';
import './globals.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import QueryProvider from '../helpers/QueryProvider';
import { ThemeProvider } from '../components/theme-provider';
import { Toaster } from '../components/ui/sonner';
import { AuthProvider } from '../context/authContext';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const custom = Imprima({
  variable: '--font-custom',
  weight: '400',
  subsets: ['latin'],
});
const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Bldox : Track Your Construction Project',
  description: 'Track Your Construction Project On The Go',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${custom.variable} ${ubuntu.variable} antialiased`}
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
