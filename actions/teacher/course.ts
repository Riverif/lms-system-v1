"use server";

import * as z from "zod";
import { CourseSchema } from "@/schemas";

export const course = async (values: z.infer<typeof CourseSchema>) => {
  const validateFields = CourseSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Something went wrong!" };
  }

  return { success: "Course Created!" };
};
