import CourseSideBar from '@/components/CourseSideBar';
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

  return (
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
  );

  //   return (
  //     <div>
  //       <CourseSideBar course={course} currentChapterId={chapter.id} />;
  //       <div>
  //         <div className="ml-[400px] px-8">
  //           <div className="flex">
  //             <MainVideoSummary chapter={chapter} chapterIndex={chapterIndex} unit={unit} unitIndex={unitIndex} />
  //             <QuizCards chapter={chapter} />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
};

export default CoursePage;
