'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Loader2, Plus, Sparkles, Target, Trash } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import { Button } from './ui/button';
import { FC } from 'react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import SubscriptionAction from './SubscriptionAction';
import axios from 'axios';
import { createChaptersSchema } from '@/lib/validators/course';
import { toast } from './ui/use-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CreateCourseFormProps {
    isPro: boolean;
}

type formSchema = z.infer<typeof createChaptersSchema>;

const CreateCourseForm: FC<CreateCourseFormProps> = ({ isPro }: CreateCourseFormProps) => {
    const router = useRouter();
    const { mutate: createChapters, isPending } = useMutation({
        mutationFn: async ({ title, units }: formSchema) => {
            const response = await axios.post('/api/course/createchapters', { title, units });
            return response.data;
        },
    });

    const form = useForm<formSchema>({
        resolver: zodResolver(createChaptersSchema),
        defaultValues: {
            title: '',
            units: ['', '', ''],
        },
    });

    function onSubmit(formData: formSchema) {
        if (formData.units.some((unit) => unit === '')) {
            toast({
                variant: 'destructive',
                title: 'Incomplete Information',
                description: 'Please fill in all course units before proceeding',
            });
            return;
        }
        createChapters(formData, {
            onSuccess: ({ course_id }) => {
                toast({
                    variant: 'default',
                    title: 'Course Created Successfully! 🎉',
                    description: 'Your personalized course is ready. Redirecting...',
                });
                router.push(`/create/${course_id}`);
            },
            onError: (error) => {
                toast({
                    variant: 'destructive',
                    title: 'Creation Failed',
                    description: 'Unable to create course. Please try again.',
                });
            },
        });
    }

    const addUnit = () => {
        const currentUnits = form.watch('units');
        if (currentUnits.length < 10) {
            form.setValue('units', [...currentUnits, '']);
        }
    };

    const removeUnit = () => {
        const currentUnits = form.watch('units');
        if (currentUnits.length > 1) {
            form.setValue('units', currentUnits.slice(0, -1));
        }
    };

    return (
        <div className="w-full space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Create Your Course
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Design a personalized learning experience
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Course Title Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-medium">Course Information</span>
                        </div>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                        Course Title
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="e.g., Advanced React Development, Machine Learning Basics..."
                                                className="h-12 text-base bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 rounded-xl transition-all duration-200"
                                                {...field}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Units Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-medium">Learning Units</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                ({form.watch('units').length} units)
                            </span>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {form.watch('units').map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeOut"
                                        }}
                                        className="group"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`units.${index}`}
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        Unit {index + 1}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder={`e.g., ${index === 0 ? 'Introduction and Setup' : index === 1 ? 'Core Concepts' : 'Advanced Topics'}`}
                                                                className="h-11 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 rounded-lg transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-500"
                                                                {...field}
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                                <span className="text-xs font-medium">#{index + 1}</span>
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Unit Controls */}
                        <div className="flex items-center justify-center">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-600">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    size="sm"
                                    className="h-9 px-4 bg-white dark:bg-slate-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-slate-200 dark:border-slate-600 hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
                                    onClick={addUnit}
                                    disabled={form.watch('units').length >= 10}
                                >
                                    <Plus className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">Add Unit</span>
                                </Button>

                                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

                                <Button
                                    variant="ghost"
                                    type="button"
                                    size="sm"
                                    className="h-9 px-4 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-slate-600 hover:border-red-200 dark:hover:border-red-700 transition-all duration-200 group"
                                    onClick={removeUnit}
                                    disabled={form.watch('units').length <= 1}
                                >
                                    <Trash className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">Remove</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-4"
                    >
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isPending}
                            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating Your Course...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Generate My Course</span>
                                </div>
                            )}
                        </Button>
                    </motion.div>
                </form>
            </Form>

            {/* Subscription CTA */}
            {!isPro && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <SubscriptionAction />
                </motion.div>
            )}
        </div>
    );
};

export default CreateCourseForm;
