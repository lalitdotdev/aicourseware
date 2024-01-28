import CreateCourseForm from '@/components/CreateCourseForm';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-16 sm:px-0 ">
      <h1 className="self-center text-3xl font-bold text-center sm:text-6xl">
        <span className="text-green-600">ai</span>courseware
      </h1>
      <div className="flex p-4 mt-5 border-none bg-secondary">
        <InfoIcon className="w-12 h-12 mr-3 text-green-600" />
        <div>
          <p className="text-sm ">
            Enter in a course title , or what you want to learn about. Then enter a list of units, which are specifics
            you want to learn and we will generate a course for you to learn from!
          </p>
        </div>
      </div>
      <CreateCourseForm />
    </div>
  );
}
