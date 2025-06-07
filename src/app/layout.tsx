import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Provider } from '@/providers/Providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

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
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    inter.className,
                    'antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
                )}
            >
                {/* Background Pattern */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105) 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                        }}
                    />
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <Provider>
                    <ReactQueryDevtools />
                    <div className="relative min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 pt-20">
                            {children}
                        </main>
                    </div>
                    <Toaster />
                </Provider>

            </body>
        </html>
    );
}
