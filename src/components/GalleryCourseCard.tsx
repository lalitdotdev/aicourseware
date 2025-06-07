import { Chapter, Course, Unit } from '@prisma/client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GalleryCourseCardProps {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[];
        })[];
    };
    className?: string;
}

const GalleryCourseCard: FC<GalleryCourseCardProps> = ({ course, className }) => {
    return (
        <div className={cn(
            "flex flex-col h-full bg-gradient-to-r from-purple-900/40 to-cyan-900/40 p-6 border border-purple-500/20 backdrop-blur-lg rounded-lg shadow-sm hover:shadow-md transition-shadow",
            className
        )}>
            <Link href={`/course/${course.id}/0/0`} className="block">
                <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                    <Image
                        src={course.image || '/placeholder-course.png'}
                        alt={course.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority
                    />
                </div>
            </Link>
            <div className="flex-1 flex flex-col p-4">
                <Link href={`/course/${course.id}/0/0`} className="hover:underline">
                    <h3 className="text-lg font-semibold text-white truncate">{course.name}</h3>
                </Link>
                <div className="mt-2 text-sm text-cyan-200">
                    {course.units.length} unit{course.units.length !== 1 && 's'}
                </div>
                <div className="mt-4 space-y-1">
                    {course.units.slice(0, 3).map((unit, idx) => (
                        <div key={unit.id} className="text-xs text-purple-100 truncate">
                            <span className="font-medium text-cyan-300">Unit {idx + 1}:</span> {unit.name}
                        </div>
                    ))}
                    {course.units.length > 3 && (
                        <div className="text-xs text-cyan-400/70">+{course.units.length - 3} more</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryCourseCard;
