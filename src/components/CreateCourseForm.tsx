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

interface CreateCourseFormProps {}

// creating type from zod object
type formSchema = z.infer<typeof createChaptersSchema>;

const CreateCourseForm: FC<CreateCourseFormProps> = ({}) => {
  const form = useForm<formSchema>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: '',
      units: ['', '', ''],
    },
  });

  function onSubmit(formData: formSchema) {
    console.log(formData);
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
          <Button type="submit" className="w-full mt-6" size="lg">
            Let&apos;s Go!
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
