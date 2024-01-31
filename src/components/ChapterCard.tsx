'use client';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

type ChapterCardProps = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = forwardRef<ChapterCardHandler, ChapterCardProps>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const { toast } = useToast();
    const [success, setSuccess] = useState<boolean | null>(null);
    const { mutate: getChapterInfo, isPending } = useMutation({
      mutationFn: async () => {
        const response = await axios.post('/api/chapter/getInfo', {
          chapterId: chapter.id,
        });
        return response.data;
      },
    });

    // add the chapter id to the completed chapters set when the success state is true (which means the chapter was loaded successfully) and the chapter id is not already in the completed chapters set
    const addChapterIdToSet = useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet;
      }
    }, [chapter, addChapterIdToSet]);

    useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
        getChapterInfo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addChapterIdToSet();
          },
          onError: (error) => {
            console.error(error);
            setSuccess(false);
            toast({
              title: 'Error',
              description: 'There was an error loading your chapter',
              variant: 'destructive',
            });
            addChapterIdToSet();
          },
        });
      },
    }));

    return (
      <div
        key={chapter.id}
        className={cn('px-4 py-2 mt-2 rounded flex justify-between', {
          'bg-secondary': success === null,
          'bg-red-500': success === false,
          'bg-green-500': success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {isPending && <Loader2 className="animate-spin" />}
      </div>
    );
  },
);

ChapterCard.displayName = 'ChapterCard';

export default ChapterCard;
