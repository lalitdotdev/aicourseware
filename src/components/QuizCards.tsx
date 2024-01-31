'use client';
import { Chapter, Question } from '@prisma/client';

import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  return (
    <div className="flex-[1] mt-16 ml-8">
      <h1 className="text-2xl font-bold">Concept Check</h1>
      <div className="mt-2">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[];
          return (
            <div key={question.id}>
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup onValueChange={(e) => {}}>
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
      <Button className="w-full mt-2" size="lg" onClick={() => {}}>
        Check Answer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default QuizCards;
