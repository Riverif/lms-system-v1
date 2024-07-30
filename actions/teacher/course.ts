"use server";

import * as z from "zod";
import { CourseSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

export const createCourse = async (values: z.infer<typeof CourseSchema>) => {
  const validateFields = CourseSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Something went wrong!" };
  }

  const user = await currentUser();
  if (!user?.id) return { error: "Unauthorized" };

  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Unauthorized" };

  const { title } = validateFields.data;

  const course = await db.course.create({
    data: {
      userId: dbUser.id,
      title,
    },
  });

  return { success: "Course Created!", id: course.id };
};
