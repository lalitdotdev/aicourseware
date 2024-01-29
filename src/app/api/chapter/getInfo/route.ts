import { NextResponse } from 'next/server';
import { resolve } from 'path';

// api/chapter/getInfo

// sleep for 0-4 seconds to simulate async behavior of real world api calls to database etc.

const sleep = async () =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 4000);
  });

export async function POST(req: Request, res: Response) {
  try {
    await sleep();
    return NextResponse.json({
      message: 'Hello World',
    });
  } catch (error) {}
}
