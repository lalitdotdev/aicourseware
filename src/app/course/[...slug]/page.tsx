import { ChevronLeft, ChevronRight } from 'lucide-react';

import CourseSideBar from '@/components/CourseSideBar';
import Link from 'next/link';
import MainVideoSummary from '@/components/MainVideoSummary';
import QuizCards from '@/components/QuizCards';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface CoursePageProps {
    params: {
        slug: string;
    };
}

const CoursePage = async ({ params: { slug } }: CoursePageProps) => {
    const [courseId, unitIndexParam, chapterIndexParam] = slug;
    const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
            units: {
                include: {
                    chapters: {
                        include: { questions: true },
                    },
                },
            },
        },
    });

    if (!course) {
        return redirect('/gallery');
    }

    let unitIndex = parseInt(unitIndexParam);
    let chapterIndex = parseInt(chapterIndexParam);

    const unit = course.units[unitIndex];
    if (!unit) {
        return redirect('/gallery');
    }
    const chapter = unit.chapters[chapterIndex];
    if (!chapter) {
        return redirect('/gallery');
    }

    const nextChapter = unit.chapters[chapterIndex + 1];
    const prevChapter = unit.chapters[chapterIndex - 1];
    /* return (
      <pre className="mt-16">
        {JSON.stringify(
          {
            courseId,
            unitIndex,
            chapterIndex,
            course,
            unit,
            chapter,
          },
          null,
          2,
        )}
      </pre>
    ); */

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900">
            <div className="flex">
                <CourseSideBar course={course} currentChapterId={chapter.id} />

                <div className="flex-1 ml-[400px] p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex gap-8">
                            <MainVideoSummary
                                chapter={chapter}
                                chapterIndex={chapterIndex}
                                unit={unit}
                                unitIndex={unitIndex}
                            />
                            <QuizCards chapter={chapter} />
                        </div>

                        <div className="h-px my-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                        <div className="flex pb-8 gap-4">
                            {prevChapter && (
                                <Link
                                    href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}
                                    className="group flex-1 p-4 rounded-xl bg-slate-900/50 border border-purple-500/20 hover:border-cyan-400/40 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <ChevronLeft className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                                        <div>
                                            <span className="text-xs text-purple-300/60">Previous</span>
                                            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-cyan-200">
                                                {prevChapter.name}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {nextChapter && (
                                <Link
                                    href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}
                                    className="group flex-1 p-4 rounded-xl bg-slate-900/50 border border-purple-500/20 hover:border-cyan-400/40 transition-all text-right"
                                >
                                    <div className="flex items-center justify-end gap-3">
                                        <div>
                                            <span className="text-xs text-purple-300/60">Next</span>
                                            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-200">
                                                {nextChapter.name}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
