"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseSchema } from "@/schemas";
import { useTransition } from "react";
import Link from "next/link";
import { course } from "@/actions/teacher/course";
import toast from "react-hot-toast";

const CreatePage = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CourseSchema>>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isValid } = form.formState;

  const onSubmit = (values: z.infer<typeof CourseSchema>) => {
    startTransition(() => {
      course(values).then((data) => {
        if (data.success) toast.success(data.success);
        if (data.error) toast.error(data.error);
      });
    });
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="e.g. 'Advanced web development'"
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isPending}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
