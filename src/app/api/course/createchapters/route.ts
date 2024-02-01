/* API END POINT /api/course/createchapters */

import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { strict_output } from '@/lib/gpt';
import { checkSubscription } from '@/lib/subscription';
import { getUnsplashImage } from '@/lib/unsplash';
import { createChaptersSchema } from '@/lib/validators/course';
import { NextResponse } from 'next/server';

import { z } from 'zod';

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const isPro = await checkSubscription();
    if (session.user.credits <= 0 && !isPro) {
      return new NextResponse('Not subscribed or No credits left', { status: 402 });
    }
    const body = await req.json();
    // parsing the body with zod validators
    const { title, units } = createChaptersSchema.parse(body);

    // type of the body object after parsing with zod validators (for reference)

    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    }[];
    // Prompt engineering 😎
    let output_units: outputUnits = await strict_output(
      'You are an AI capable of curating course content, coming up with relevant chapter titles, and finding best relevant youtube videos for each chapter',
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give best educational informative course in youtube.`,
      ),
      {
        title: 'title of the unit',
        chapters:
          'an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object',
      },
    );
    // console.log(output_units);
    // return NextResponse.json(output_units); // returning next response with the output
    const imageSearchTerm = await strict_output(
      'you are an AI capable of finding the most relevant image for a course',
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
      {
        image_search_term: 'a good search term for the title of the course',
      },
    );

    const course_image = await getUnsplashImage(imageSearchTerm.image_search_term);

    // Now create the course in the database
    const course = await db.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });

    // Now create the units and chapters in the database for the course
    for (const unit of output_units) {
      const title = unit.title;
      const dbUnit = await db.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await db.chapter.createMany({
        data: unit.chapters.map((chapter) => ({
          name: chapter.chapter_title,
          unitId: dbUnit.id,
          youtubeSearchQuery: chapter.youtube_search_query,
        })),
      });
    }

    // Now update the user credits
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    // console.log(imageSearchTerm);
    // return NextResponse.json({
    //   output_units,
    //   image_search_term: imageSearchTerm.image_search_term,
    //   course_image,
    // });
    return NextResponse.json({
      course_id: course.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('invalid body', { status: 400 });
    }
    console.log(error);
  }
}
