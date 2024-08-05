"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { CourseSchema } from "@/schemas";
import { getUserById } from "@/data/user";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const updateCoursePublish = async (courseId: string) => {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) return { error: "Not found" };

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished,
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return { error: "Missing require fields" };
    }

    if (course.isPublished) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
      revalidatePath("/teacher/course/[courseId]", "page");
      return { success: "Course Unpublished!" };
    } else {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: true },
      });
      revalidatePath("/teacher/course/[courseId]", "page");
      return { success: "Course Published!" };
    }
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};
export const deleteCourse = async (courseId: string) => {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) return { error: "Not found" };

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter.muxData.assetId);
      }
    }

    await db.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/teacher/course/[courseId]", "page");
    return { success: "Course deleted!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const updateCoursePrice = async (
  values: z.infer<typeof CourseSchema.coursePrice>,
  courseId: string,
) => {
  try {
    const validateFields = CourseSchema.coursePrice.safeParse(values);

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
