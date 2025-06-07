import { ArrowRight, BookOpen, Info, Sparkles, Zap } from 'lucide-react';

import ConfirmChapters from '@/components/ConfirmChapters';
import { FC } from 'react';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface CreateChaptersProps {
    params: { courseId: string };
}

const CreateChapters: FC<CreateChaptersProps> = async ({ params: { courseId } }) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            units: {
                include: {
                    chapters: true,
                },
            },
        },
    });

    if (!course) {
        return redirect('/');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 py-16">
                {/* Breadcrumb with modern styling */}
                <div className="flex items-center gap-2 mb-8 text-sm font-medium">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span className="text-white/70">Course</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                    <div className="px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-400/30">
                        <span className="text-purple-200 font-semibold">{course.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30">
                        <span className="text-cyan-200">Create Chapters</span>
                    </div>
                </div>

                {/* Main title section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-2xl shadow-purple-500/25">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                            {course.name}
                        </h1>
                    </div>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        AI-powered chapter generation complete. Review and customize your learning journey.
                    </p>
                </div>

                {/* AI Info Card */}
                <div className="w-full max-w-4xl mb-12">
                    <div className="group relative">
                        {/* Animated border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-400/25">
                                        <div className="relative">
                                            <Info className="w-8 h-8 text-white" />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-2xl font-bold text-white">AI Chapter Generation Complete</h3>
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-medium text-green-300">READY</span>
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/70 leading-relaxed mb-6">
                                        Our advanced AI has intelligently generated comprehensive chapters for each unit in your course.
                                        Each chapter is carefully structured to provide optimal learning progression and engagement.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Zap className="w-5 h-5 text-yellow-400" />
                                            <div>
                                                <div className="text-sm font-semibold text-white">Smart Structure</div>
                                                <div className="text-xs text-white/60">Optimized flow</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <BookOpen className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <div className="text-sm font-semibold text-white">Comprehensive</div>
                                                <div className="text-xs text-white/60">Full coverage</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                            <div>
                                                <div className="text-sm font-semibold text-white">AI-Enhanced</div>
                                                <div className="text-xs text-white/60">Next-gen learning</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Chapters Component */}
                <div className="w-full max-w-4xl">
                    <ConfirmChapters course={course} />
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-3000"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-4000"></div>
            </div>

        </div>
    );
};

export default CreateChapters;
