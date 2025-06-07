import GalleryCourseCard from '@/components/GalleryCourseCard';
import { Sparkles } from 'lucide-react';
import { db } from '@/lib/db';

interface GalleryPageProps { }

const GalleryPage = async ({ }: GalleryPageProps) => {
    const courses = await db.course.findMany({
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
            <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-3 px-6 py-2 mb-4 rounded-full bg-gradient-to-r from-purple-900/50 to-cyan-900/30">
                        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                        <h1 className="text-sm font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                            AI COURSE CATALOG
                        </h1>
                    </div>
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-cyan-100">
                        Explore Interactive Courses
                    </h2>
                </div>

                {/* Course Grid */}
                {courses.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {courses.map((course) => (
                            <GalleryCourseCard
                                course={course}
                                key={course.id}
                                className="transition-all  hover:shadow-purple-500/20"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-xl text-slate-300/80">
                            No courses available yet. Start creating!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryPage;
