'use client';

import { Button, buttonVariants } from './ui/button';
import { Chapter, Course, Unit } from '@prisma/client';
import ChapterCard, { ChapterCardHandler } from './ChapterCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import Link from 'next/link';
import React from 'react';
import { Separator } from './ui/separator';

type Props = {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[];
        })[];
    };
};

const ConfirmChapters = ({ course }: Props) => {
    const [loading, setLoading] = React.useState(false);

    // Refs for chapter cards
    const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
    course.units.forEach((unit) => {
        unit.chapters.forEach((chapter) => {
            chapterRefs[chapter.id] = React.useRef(null);
        });
    });

    const [completedChapters, setCompletedChapters] = React.useState<Set<String>>(new Set());
    const totalChaptersCount = React.useMemo(() => {
        return course.units.reduce((acc, unit) => acc + unit.chapters.length, 0);
    }, [course.units]);

    return (
        <div className="w-full mt-4">
            {/* Animated progress bar */}
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-400 animate-pulse" size={22} />
                    <span className="text-sm text-white/60">
                        {completedChapters.size} of {totalChaptersCount} chapters confirmed
                    </span>
                </div>
                <div className="w-full h-2 mt-2 rounded-full bg-gradient-to-r from-purple-900 via-cyan-900 to-slate-900 relative overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 transition-all duration-700"
                        style={{
                            width: `${(completedChapters.size / totalChaptersCount) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Units and Chapters */}
            <div className="space-y-8">
                {course.units.map((unit, unitIndex) => (
                    <div key={unit.id} className="p-6 rounded-3xl bg-gradient-to-br from-slate-950/80 via-purple-950/60 to-slate-900/80 border border-white/10 shadow-lg shadow-purple-500/10">
                        <h2 className="text-xs uppercase tracking-widest text-cyan-300/80 mb-1">Unit {unitIndex + 1}</h2>
                        <h3 className="text-2xl font-bold text-white mb-4">{unit.name}</h3>
                        <div className="space-y-3">
                            {unit.chapters.map((chapter, chapterIndex) => (
                                <ChapterCard
                                    completedChapters={completedChapters}
                                    setCompletedChapters={setCompletedChapters}
                                    ref={chapterRefs[chapter.id]}
                                    key={chapter.id}
                                    chapter={chapter}
                                    chapterIndex={chapterIndex}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center justify-center mt-10">
                <Separator className="flex-[1]" />
                <div className="flex items-center mx-4 gap-4">
                    <Link
                        href="/create"
                        className={buttonVariants({ variant: 'secondary', className: 'backdrop-blur-md border border-white/10' })}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={4} />
                        Back
                    </Link>
                    {totalChaptersCount === completedChapters.size ? (
                        <Link
                            className={buttonVariants({
                                className: 'font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20 border-0',
                            })}
                            href={`/course/${course.id}/0/0`}
                        >
                            Save & Continue
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                    ) : (
                        <Button
                            type="button"
                            className="font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20 border-0"
                            disabled={loading}
                            onClick={() => {
                                setLoading(true);
                                Object.values(chapterRefs).forEach((ref) => {
                                    ref.current?.triggerLoad();
                                });
                            }}
                        >
                            Generate
                            <ChevronRight className="w-4 h-4 ml-2" strokeWidth={4} />
                        </Button>
                    )}
                </div>
                <Separator className="flex-[1]" />
            </div>
        </div>
    );
};

export default ConfirmChapters;
