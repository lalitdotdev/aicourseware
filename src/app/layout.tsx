import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Provider } from '@/providers/Providers';

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
      <body className={cn(inter.className, 'antialiased min-h-screen p-8')}>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
