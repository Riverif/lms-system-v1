"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { ChapterSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

export const createChapter = async (
  values: z.infer<typeof ChapterSchema>,
  courseId: string,
) => {
  try {
    const validateFields = ChapterSchema.safeParse(values);

    if (!validateFields.success) {
      return { error: "Something went wrong!" };
    }

    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: dbUser.id,
      },
    });
    if (!courseOwner) return { error: "Unauthorized" };

    const { title } = validateFields.data;

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    });

    return { success: "Chapter created", id: chapter.id };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};
