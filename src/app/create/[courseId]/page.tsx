import ConfirmChapters from '@/components/ConfirmChapters';
import { toast } from '@/components/ui/use-toast';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Info } from 'lucide-react';
import { redirect } from 'next/navigation';
import { FC } from 'react';

interface CreateChaptersProps {
  params: { courseId: string };
}

const CreateChapters: FC<CreateChaptersProps> = async ({ params: { courseId } }) => {
  const session = await getAuthSession();
  if (!session?.user) {
    // show toast that user is not logged in and redirect to login page
    return redirect('/');
  }

  //   Getting the course details by the courseId

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

  // If the course is not found then redirect to home page
  if (!course) {
    return redirect('/');
  }

  //   return <pre>{JSON.stringify(course, null, 2)}</pre>;
  return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
      <h5 className="text-sm uppercase text-secondary-foreground/60">Course / {course.name} / Create Chapters</h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>
      <div className="flex p-4 mt-5 border-none bg-secondary">
        <Info className="w-12 h-12 mr-3 text-green-500" />
        <p className="text-xl text-secondary-foreground/60">
          We generated chapters for each of your units. Look over them and then click the Button to confirm and
          continue.
        </p>
      </div>
      <ConfirmChapters course={course} />
    </div>
  );
};

export default CreateChapters;
