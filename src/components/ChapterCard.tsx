'use client';

import { CheckCircle2, Loader2, Sparkles, XCircle } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import { Chapter } from '@prisma/client';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';

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
                addChapterIdToSet();
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
                className={cn(
                    'flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-300 shadow-xl',
                    'backdrop-blur-md bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-slate-800/60',
                    {
                        'border-purple-400/50 shadow-purple-500/10': success === null,
                        'border-green-400/70 bg-gradient-to-r from-green-900/60 to-emerald-900/60 shadow-green-500/15': success === true,
                        'border-red-500/70 bg-gradient-to-r from-red-900/60 to-pink-900/60 shadow-red-500/15': success === false,
                    }
                )}
            >
                <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">{chapterIndex + 1}.</span>
                    <h5 className="font-semibold text-white">{chapter.name}</h5>
                </div>
                <div className="flex items-center gap-2">
                    {isPending && <Loader2 className="animate-spin text-cyan-400" />}
                    {success === true && <CheckCircle2 className="text-green-400 animate-pulse" />}
                    {success === false && <XCircle className="text-red-400 animate-pulse" />}
                    {success === null && <Sparkles className="text-purple-400/60 animate-pulse" />}
                </div>
            </div>
        );
    }
);

ChapterCard.displayName = 'ChapterCard';

export default ChapterCard;
