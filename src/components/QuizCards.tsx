'use client';
import { Chapter, Question } from '@prisma/client';

import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [questionState, setQuestionState] = useState<Record<string, boolean | null>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({}); // this is the state that we need to store the answers for the quiz cards.

  //   console.log(answers);

  // Function that we need to call when the check answer button is clicked on the quiz cards component to check if the answer is correct or not and then set the state accordingly
  const checkAnswer = useCallback(() => {
    const newQuestionState = { ...questionState };

    chapter.questions.forEach((question) => {
      const user_answer = answers[question.id];
      if (!user_answer) return;
      if (user_answer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
      setQuestionState(newQuestionState);
    });
  }, [answers, questionState, chapter.questions]);

  return (
    <div className="flex-[1] mt-16 ml-8">
      <h1 className="text-2xl font-bold">Concept Check</h1>
      <div className="mt-2">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[]; // this is the array of options for the question that we need to parse from the json string in the database

          console.log(options);
          return (
            <div
              key={question.id}
              className={cn('p-3 text-white mt-4 border border-secondary rounded-lg', {
                'bg-green-600': questionState[question.id] === true,
                'bg-red-600': questionState[question.id] === false,
                'bg-secondary': questionState[question.id] === null,
              })}
            >
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, index) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem value={option} id={question.id + index.toString()} />
                        <Label htmlFor={question.id + index.toString()}>{option}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="w-full mt-2" size="lg" onClick={checkAnswer}>
        Check Answer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default QuizCards;
