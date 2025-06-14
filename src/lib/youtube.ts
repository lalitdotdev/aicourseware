import { YoutubeTranscript } from 'youtube-transcript';
import axios from 'axios';
import { strict_output } from './gpt';

export async function searchYoutube(searchQuery: string) {
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
  );
  if (!data) {
    console.log('Youtube fail');
    return null;
  }
  if (data.items[0] === undefined) {
    console.log('Youtube fail');
    return null;
  }
  const videoId = data.items[0].id.videoId;
  return videoId;
}

// get transcript from youtube video Id
export async function getTranscript(videoId: string) {
  try {
    // Remove 'country' property
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    if (!transcript_arr || transcript_arr.length === 0) {
      // fallback to auto-detect
      transcript_arr = await YoutubeTranscript.fetchTranscript(videoId);
    }
    if (!transcript_arr || transcript_arr.length === 0) {
      console.log('No transcript found for video:', videoId);
      return '';
    }
    return transcript_arr
      .map((t) => t.text)
      .join(' ')
      .replaceAll('\n', ' ');
  } catch (error) {
    console.log('Transcript fetch error for video:', videoId, error);
    return '';
  }
}

// GetQuestion from Transcript

export async function getQuestionsFromTranscript(transcript: string, course_title: string) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };
  const questions: Question[] = await strict_output(
    'You are a helpful AI that is able to generate more than two best multiple choice questions and answers, the length of each answer should not be more than 15 words',
    new Array(5).fill(
      `You are to generate a random hard multiple choice questions about ${course_title} with context of the following transcript: ${transcript} for concept check`,
    ),
    {
      question: 'question',
      answer: 'answer with max length of 15 words',
      option1: 'option1 with max length of 15 words',
      option2: 'option2 with max length of 15 words',
      option3: 'option3 with max length of 15 words',
    },
  );

  return questions;
}
