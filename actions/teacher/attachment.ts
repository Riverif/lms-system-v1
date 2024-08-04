"use server";
import * as z from "zod";

import { db } from "@/lib/db";
import { AttachmentSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";

export const deleteAttachment = async (
  attachmentId: string,
  courseId: string,
) => {
  try {
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

    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    revalidatePath("/teacher/course/[courseId]", "page");

    return { success: "Attachment Deleted!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const createAttachment = async (
  values: z.infer<typeof AttachmentSchema>,
  courseId: string,
) => {
  try {
    const validateFields = AttachmentSchema.safeParse(values);

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

    const { url } = validateFields.data;

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop() || "",
        courseId: courseId,
      },
    });

    revalidatePath("/teacher/course/[courseId]", "page");

    return { success: "Attachment Created!", id: attachment.id };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};
