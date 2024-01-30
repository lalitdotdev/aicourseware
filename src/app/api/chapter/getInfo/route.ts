import { db } from '@/lib/db';
import { strict_output } from '@/lib/gpt';
import { getQuestionsFromTranscript, getTranscript, searchYoutube } from '@/lib/youtube';
import { NextResponse } from 'next/server';
import { resolve } from 'path';
import { z } from 'zod';

// api/chapter/getInfo

// sleep for 0-4 seconds to simulate async behavior of real world api calls to database etc.

const bodyParser = z.object({
  // converting the body to a zod schema to validate it and get the types
  chapterId: z.string(),
});
// const sleep = async () =>
//   new Promise((resolve) => {
//     setTimeout(resolve, Math.random() * 4000);
//   });

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);

    // Get Chapter Info from Database using chapterId

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chapter not found',
        },
        {
          status: 404,
        },
      );
    }

    // Get Youtube Video Id from Youtube Search Query
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);

    // Get Transcript from Youtube Video Id
    let videoTranscript = await getTranscript(videoId);

    // Getting summary from transcript using GPT-3 API (OpenAI) and returning it in the response (strict_output is a helper function to make the API call to GPT-3) (see lib/gpt.ts)
    let maxLength = 500;
    videoTranscript = videoTranscript.split(' ').slice(0, maxLength).join(' ');
    const { summary }: { summary: string } = await strict_output(
      'You are an AI capable of summarising a youtube transcript',
      'summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n' +
        videoTranscript,
      { summary: 'summary of the transcript' },
    );

    const questions = await getQuestionsFromTranscript(videoTranscript, chapter.name);

    // create questions in database
    await db.question.createMany({
      data: questions.map((question) => {
        let options = [question.answer, question.option1, question.option2, question.option3];
        options = options.sort(() => Math.random() - 0.5); // shuffle the options array randomly (see https://stackoverflow.com/a/2450976/13697995)
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    // Update Chapter in Database with videoId and summary

    await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        videoId,
        summary,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues,
        },
        {
          status: 400,
        },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Something went wrong',
        },
        {
          status: 500,
        },
      );
    }
  }
}
