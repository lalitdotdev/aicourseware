import { BookOpen, Library, Plus, Settings, Sparkles } from 'lucide-react';

import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';
import { ThemeToggle } from './ThemeToggle';
import UserAccountNav from './UserAccountNav';
import { getAuthSession } from '@/lib/auth';

type Props = {};

const Navbar = async (props: Props) => {
    const session = await getAuthSession();

    return (
        <>
            {/* Backdrop blur support */}
            <div className="fixed inset-x-0 top-0 z-40 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <nav className="h-full">
                    <div className="flex items-center justify-between h-full px-6 mx-auto max-w-7xl lg:px-8">
                        {/* Logo Section */}
                        <Link href="/gallery" className="flex items-center group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="font-bold text-xl">
                                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            ai
                                        </span>
                                        <span className="text-slate-900 dark:text-white">courseware</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {/* Gallery Link */}
                            <Link
                                href="/gallery"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                            >
                                <Library className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Course Catalog</span>
                            </Link>

                            {session?.user && (
                                <>
                                    {/* Create Course Link */}
                                    <Link
                                        href="/create"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                                    >
                                        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span>Create Course</span>
                                    </Link>

                                    {/* Settings Link */}
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                                    >
                                        <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span>Settings</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-3">
                            {/* Theme Toggle */}
                            <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-200">
                                <ThemeToggle />
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

                            {/* User Section */}
                            <div className="flex items-center">
                                {session?.user ? (
                                    <UserAccountNav user={session.user} />
                                ) : (
                                    <SignInButton />
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {session?.user && (
                <div className="fixed bottom-0 inset-x-0 z-40 md:hidden">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 px-4 py-2 shadow-lg">
                        <div className="flex items-center justify-around max-w-sm mx-auto">
                            <Link
                                href="/gallery"
                                className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Library className="w-5 h-5" />
                                <span>Catalog</span>
                            </Link>

                            <Link
                                href="/create"
                                className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create</span>
                            </Link>

                            <Link
                                href="/settings"
                                className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
