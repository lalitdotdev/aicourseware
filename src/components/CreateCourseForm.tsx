'use client';

import { createChaptersSchema } from '@/lib/validators/course';
import { FC } from 'react';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Plus, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import SubscriptionAction from './SubscriptionAction';

interface CreateCourseFormProps {
  isPro: boolean;
}

// creating type from zod object
type formSchema = z.infer<typeof createChaptersSchema>;

const CreateCourseForm: FC<CreateCourseFormProps> = ({ isPro }: CreateCourseFormProps) => {
  //!  Basics of React query
  //   Mutations are functions that allow you to modify data on the server.
  //   They're called mutations because they mutate data.
  //   useQuery is a React hook that fetches data from the server and returns that data to your React components.

  //  isLoading is deprected in new version of react-query v5

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
    // if any of the units is empty then return
    if (formData.units.some((unit) => unit === '')) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Data',
        description: 'Please fill in all the fields',
      });
      return;
    }
    createChapters(formData, {
      // on success we will get course_id returned from the server
      onSuccess: ({ course_id }) => {
        toast({
          variant: 'default',
          title: 'Course created ✅',
          description: 'Your course has been created successfully',
        });
        router.push(`/create/${course_id}`);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Error Occured',
          description: 'Something went wrong, please try again later',
        });
      },
    });
  }

  //   console.log(form.watch());
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                <FormControl className="flex-[6]">
                  <Input placeholder="Enter the main topic of the course " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence>
            {form.watch('units').map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                }}
              >
                <FormField
                  control={form.control}
                  name={`units.${index}`}
                  key={index}
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                      <FormLabel className="flex-[1] text-xl">Unit {index + 1}</FormLabel>
                      <FormControl className="flex-[6]">
                        <Input placeholder="Enter subtopic of the course " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1]" />
            <div className="mx-4">
              <Button
                variant="secondary"
                type="button"
                className="font-semibold ml-2 gap-1 "
                onClick={() => {
                  form.setValue('units', [...form.watch('units'), '']);
                }}
              >
                <Plus className="w-4 h-4 ml-2 text-green-500" />
                Add Unit
              </Button>

              <Button
                variant="secondary"
                type="button"
                className="font-semibold ml-2 gap-1"
                onClick={() => {
                  form.setValue('units', [...form.watch('units').slice(0, -1)]);
                }}
              >
                <Trash className="w-4 h-4 ml-2 text-green-500" />
                Remove Unit
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          <Button type="submit" className="w-full mt-6" size="lg" disabled={isPending}>
            Let&apos;s Go!
          </Button>
        </form>
      </Form>
      {!isPro && <SubscriptionAction />}
    </div>
  );
};

export default CreateCourseForm;
