"use server";

import * as z from "zod";
import { CourseSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateCourseCategory = async (
  values: z.infer<typeof CourseSchema.courseCategory>,
  courseId: string,
) => {
  try {
    const validateFields = CourseSchema.courseCategory.safeParse(values);

    if (!validateFields.success) {
      return { error: "Something went wrong!" };
    }

    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    await db.course.update({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
      data: {
        ...validateFields.data,
      },
    });
    revalidatePath("/teacher/course/[courseId]", "page");

    return { success: "Category updated!" };
  } catch {
    return { error: "Something went wrong!" };
  }
};

export const updateCourseImage = async (
  values: z.infer<typeof CourseSchema.courseImage>,
  courseId: string,
) => {
  try {
    const validateFields = CourseSchema.courseImage.safeParse(values);

    if (!validateFields.success) {
      return { error: "Something went wrong!" };
    }

    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    await db.course.update({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
      data: {
        ...validateFields.data,
      },
    });
    revalidatePath("/teacher/course/[courseId]", "page");

    return { success: "Image updated!" };
  } catch {
    return { error: "Something went wrong!" };
  }
};

export const updateCourseDescription = async (
  values: z.infer<typeof CourseSchema.courseDescription>,
  courseId: string,
) => {
  try {
    const validateFields = CourseSchema.courseDescription.safeParse(values);

    if (!validateFields.success) {
      return { error: "Something went wrong!" };
    }

    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    await db.course.update({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
      data: {
        ...validateFields.data,
      },
    });
    revalidatePath("/teacher/course/[courseId]", "page");

    return { success: "Description updated!" };
  } catch {
    return { error: "Something went wrong!" };
  }
};

export const updateCourseTitle = async (
  values: z.infer<typeof CourseSchema.courseTitle>,
  courseId: string,
) => {
  try {
    const validateFields = CourseSchema.courseTitle.safeParse(values);

    if (!validateFields.success) {
      return { error: "Something went wrong!" };
    }

    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    await db.course.update({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
      data: {
        ...validateFields.data,
      },
    });
    revalidatePath("/teacher/course/[courseId]", "page");

    return { success: "Title updated!" };
  } catch {
    return { error: "Something went wrong!" };
  }
};

export const createCourse = async (
  values: z.infer<typeof CourseSchema.courseTitle>,
) => {
  const validateFields = CourseSchema.courseTitle.safeParse(values);

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
