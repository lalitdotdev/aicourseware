import { BookOpenCheck, Bookmark, Sparkles } from 'lucide-react';
import { Chapter, Course, Unit } from '@prisma/client';

import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CourseSideBarProps {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[];
        })[];
    };
    currentChapterId?: string;
}

const CourseSideBar: FC<CourseSideBarProps> = async ({ course, currentChapterId }) => {
    return (
        <div className="w-[400px] fixed overflow-y-auto  h-full p-8 border-r border-purple-500/20 bg-gradient-to-b from-slate-950/95 to-purple-950/30 backdrop-blur-xl shadow-2xl shadow-purple-500/10 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">


            <div className="space-y-8">
                {course.units.map((unit, unitIndex) => (
                    <div
                        key={unit.id}
                        className="p-6 rounded-2xl bg-slate-900/40 border border-purple-500/20 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpenCheck className="w-5 h-5 text-cyan-400" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">
                                Unit {unitIndex + 1}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-cyan-100">
                            {unit.name}
                        </h2>

                        <div className="mt-4 space-y-2">
                            {unit.chapters.map((chapter, chapterIndex) => (
                                <Link
                                    key={chapter.id}
                                    href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                                    className={cn(
                                        'block px-4 py-3 rounded-xl transition-all duration-300',
                                        'hover:bg-slate-800/30 hover:border-purple-500/40 border border-transparent',
                                        {
                                            'bg-gradient-to-r from-purple-900/50 to-cyan-900/30 border-cyan-400/30':
                                                chapter.id === currentChapterId,
                                        }
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Bookmark className={cn(
                                            'w-4 h-4 flex-shrink-0',
                                            chapter.id === currentChapterId
                                                ? 'text-cyan-400 fill-current'
                                                : 'text-purple-400/40'
                                        )} />
                                        <span className={cn(
                                            'text-sm font-medium',
                                            chapter.id === currentChapterId
                                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300'
                                                : 'text-slate-300/80 hover:text-slate-100'
                                        )}>
                                            {chapter.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>
    );
};

export default CourseSideBar;
