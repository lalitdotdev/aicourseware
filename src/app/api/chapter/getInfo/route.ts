import { getQuestionsFromTranscript, getTranscript, searchYoutube } from '@/lib/youtube';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { strict_output } from '@/lib/gpt';
import { z } from 'zod';

const bodyParser = z.object({
  chapterId: z.string(),
});

// Proper Fisher-Yates shuffle implementation
const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function POST(req: Request, res: Response) {
  try {
    console.log('[CHAPTER PROCESSING] Starting processing');

    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);

    // Get Chapter Info
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      console.error(`[CHAPTER ${chapterId}] Not found`);
      return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
    }

    // Validate YouTube search query
    if (!chapter.youtubeSearchQuery?.trim()) {
      console.error(`[CHAPTER ${chapterId}] Invalid search query`);
      return NextResponse.json({ success: false, error: 'Invalid YouTube search query' }, { status: 400 });
    }

    // Get YouTube Video ID
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    if (!videoId) {
      console.error(`[CHAPTER ${chapterId}] No YouTube video found`);
      return NextResponse.json({ success: false, error: 'No YouTube video found' }, { status: 404 });
    }
    console.log(`[CHAPTER ${chapterId}] Found video ID: ${videoId}`);

    // Get Transcript
    const videoTranscript = await getTranscript(videoId);
    if (!videoTranscript) {
      console.error(`[CHAPTER ${chapterId}] No transcript available`);
      return NextResponse.json({ success: false, error: 'No transcript available' }, { status: 404 });
    }
    console.log(`[CHAPTER ${chapterId}] Transcript length: ${videoTranscript.length}`);

    // Truncate transcript intelligently
    const truncatedTranscript = videoTranscript.split(' ').slice(0, 500).join(' ');

    // Generate Summary
    let summary;
    try {
      const result = await strict_output(
        'You are an AI capable of summarising YouTube transcripts',
        `Summarize this transcript in 250 words or less, focusing on core concepts:\n${truncatedTranscript}`,
        { summary: 'summary of the transcript' },
      );
      summary = result.summary;
    } catch (error) {
      console.error(`[CHAPTER ${chapterId}] Summary generation failed:`, error);
      return NextResponse.json({ success: false, error: 'Failed to generate summary' }, { status: 500 });
    }

    // Generate Questions
    let questions;
    try {
      questions = await getQuestionsFromTranscript(truncatedTranscript, chapter.name);
    } catch (error) {
      console.error(`[CHAPTER ${chapterId}] Question generation failed:`, error);
      return NextResponse.json({ success: false, error: 'Failed to generate questions' }, { status: 500 });
    }

    // Database Transaction
    try {
      await db.$transaction([
        db.chapter.update({
          where: { id: chapterId },
          data: { videoId, summary },
        }),
        db.question.createMany({
          data: questions.map((question) => {
            const options = shuffleArray([question.answer, question.option1, question.option2, question.option3]);
            return {
              question: question.question,
              answer: question.answer,
              options: JSON.stringify(options),
              chapterId: chapterId,
            };
          }),
        }),
      ]);
      console.log(`[CHAPTER ${chapterId}] Successfully updated database`);
    } catch (dbError) {
      console.error(`[CHAPTER ${chapterId}] Database transaction failed:`, dbError);
      return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CHAPTER PROCESSING] General error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
