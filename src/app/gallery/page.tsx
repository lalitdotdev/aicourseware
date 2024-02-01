import GalleryCourseCard from '@/components/GalleryCourseCard';
import { db } from '@/lib/db';
import Link from 'next/link';
import React from 'react';

interface GalleryPageProps {}
const GalleryPage = async ({}: GalleryPageProps) => {
  // Get all courses details from the database
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
    <div className="py-8 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        {courses.map((course) => {
          return <GalleryCourseCard course={course} key={course.id} />;
        })}
      </div>
    </div>
  );
};

export default GalleryPage;
