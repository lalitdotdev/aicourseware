'use client';

import { Chapter, Course, Unit } from '@prisma/client';
import { FC, useMemo, useState } from 'react';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ConfirmChaptersProps {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
}

const ConfirmChapters: FC<ConfirmChaptersProps> = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const totalChaptersCount = 5;

  return (
    <div className="w-full mt-4">
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-5">
            <h2 className="text-sm uppercase text-secondary-foreground/60">Unit {unitIndex + 1}</h2>
            <h3 className="text-2xl font-bold">{unit.name}</h3>
            <div className="mt-3">
              {unit.chapters.map((chapter, chapterIndex) => {
                return <div key={chapterIndex}>Each chapter Card</div>;
              })}
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center mt-4">
        <Separator className="flex-[1]" />
        <div className="flex items-center mx-4">
          <Link
            href="/create"
            className={buttonVariants({
              variant: 'secondary',
            })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={4} />
            Back
          </Link>
          {totalChaptersCount === 5 ? (
            <Link
              className={buttonVariants({
                className: 'ml-4 font-semibold',
              })}
              href={`/course/${course.id}/0/0`}
            >
              Save & Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Button
              type="button"
              className="ml-4 font-semibold"
              disabled={loading}
              onClick={() => {
                setLoading(true);
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
