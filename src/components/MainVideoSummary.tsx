import { Chapter, Unit } from '@prisma/client';

import React from 'react';

type Props = {
    chapter: Chapter;
    unit: Unit;
    unitIndex: number;
    chapterIndex: number;
};

const MainVideoSummary = ({ unit, unitIndex, chapter, chapterIndex }: Props) => {
    console.log(chapter)
    return (
        <div className="flex-[2] mt-16 pr-8">
            <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 p-6 rounded-3xl border border-purple-500/20 backdrop-blur-lg">
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    Unit {unitIndex + 1} • Chapter {chapterIndex + 1}
                </span>
                <h1 className="mt-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-cyan-100">
                    {chapter.name}
                </h1>

                <div className="mt-6 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
                    <iframe
                        title="chapter video"
                        className="w-full aspect-video rounded-xl border-2 border-purple-500/30 bg-slate-900/50 backdrop-blur-sm shadow-xl"
                        src={`https://www.youtube.com/embed/${chapter.videoId}`}
                        allowFullScreen
                    />
                </div>

                <div className="mt-8 p-6 rounded-xl bg-slate-900/30 border border-purple-500/20">
                    <h3 className="text-2xl font-semibold text-cyan-100 mb-4">Key Insights</h3>
                    <p className="text-slate-200/80 leading-relaxed">{chapter.summary}</p>
                </div>
            </div>
        </div>
    );
};

export default MainVideoSummary;
