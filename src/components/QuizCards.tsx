'use client';

import { Chapter, Question } from '@prisma/client';
import { ChevronRight, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useCallback, useState } from 'react';

import { Button } from './ui/button';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

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
        <div className="flex-1 mt-16 ml-8 p-6 rounded-3xl bg-slate-900/50 border border-purple-500/20 backdrop-blur-lg">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Concept Check
            </h1>

            <div className="mt-6 space-y-4">
                {chapter.questions.map((question) => {
                    const options = JSON.parse(question.options) as string[];

                    return (
                        <div
                            key={question.id}
                            className={cn(
                                'p-4 rounded-xl border backdrop-blur-sm transition-all',
                                {
                                    'border-green-500/40 bg-green-900/20': questionState[question.id] === true,
                                    'border-red-500/40 bg-red-900/20': questionState[question.id] === false,
                                    'border-purple-500/30 bg-slate-800/20': questionState[question.id] === null,
                                }
                            )}
                        >
                            <h2 className="text-lg font-semibold text-cyan-100">{question.question}</h2>

                            <RadioGroup
                                className="mt-3 space-y-2"
                                onValueChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e }))}
                            >
                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/10 hover:bg-slate-700/20 transition-colors"
                                    >
                                        <RadioGroupItem
                                            value={option}
                                            id={question.id + index}
                                            className="text-purple-400 border-2 border-current"
                                        />
                                        <label
                                            htmlFor={question.id + index}
                                            className="text-sm font-medium text-slate-200"
                                        >
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    );
                })}
            </div>

            <Button
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/20"
                size="lg"
                onClick={checkAnswer}
            >
                Verify Answers
                <Sparkles className="w-4 h-4 ml-2 fill-current" />
            </Button>
        </div>
    );
};

export default QuizCards;
