import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Provider } from '@/providers/Providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aicourseware',
  description: 'NextGen EduHub: Transformative AI-Powered Learning Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'antialiased min-h-screen p-8 mt-4')}>
        <Provider>
          <ReactQueryDevtools />
          <Navbar />
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
