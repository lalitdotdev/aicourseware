import { BookOpen, InfoIcon, Sparkles } from 'lucide-react';

import CreateCourseForm from '@/components/CreateCourseForm';
import React from 'react';
import { checkSubscription } from '@/lib/subscription';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

type Props = {};

const CreatePage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/gallery');
    }
    const isPro = await checkSubscription();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex flex-col items-center max-w-4xl px-6 mx-auto py-16 sm:px-8">
                {/* Header Section */}
                <div className="text-center mb-12 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">AI-Powered Learning</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                        aicourseware
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Transform your learning journey with AI-generated courses tailored to your needs
                    </p>
                </div>

                {/* Info Card */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
                                        How it works
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Enter a course title or topic you want to learn about. Then specify the units or subtopics you&apos;d like to cover.
                                        Our advanced AI will create a comprehensive, structured course just for you with detailed chapters and content.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full max-w-2xl">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
                            <CreateCourseForm isPro={isPro} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
