"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { ChapterSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { url } from "inspector";
import { error } from "console";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const updateChapterPublish = async (
  courseId: string,
  chapterId: string,
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

    const dbChapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const dbMuxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });

    if (
      !dbChapter ||
      !dbMuxData ||
      !dbChapter.title ||
      !dbChapter.description ||
      !dbChapter.videoUrl
    ) {
      return { error: "Missing required fields!" };
    }

    if (dbChapter.isPublished) {
      await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          isPublished: false,
        },
      });

      const publishedChaptersInCourse = await db.chapter.findMany({
        where: {
          courseId,
          isPublished: true,
        },
      });

      if (!publishedChaptersInCourse.length) {
        await db.course.update({
          where: {
            id: courseId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    } else {
      await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          isPublished: true,
        },
      });
    }

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter updated!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};
export const deleteChapter = async (courseId: string, chapterId: string) => {
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

    const dbChapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    if (!dbChapter) {
      return { error: "Chapter not found!" };
    }

    if (dbChapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter deleted!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const updateChapterVideo = async (
  values: z.infer<typeof ChapterSchema.chapterVideo>,
  courseId: string,
  chapterId: string,
) => {
  try {
    const validateFields = ChapterSchema.chapterVideo.safeParse(values);

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

    await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...validateFields.data,
      },
    });

    const existingMuxData = await db.muxData.findFirst({
      where: {
        chapterId,
      },
    });

    if (existingMuxData) {
      await video.assets.delete(existingMuxData.assetId);
      await db.muxData.delete({
        where: {
          id: existingMuxData.id,
        },
      });
    }

    const asset = await video.assets.create({
      input: [{ url: validateFields.data.videoUrl }],
      playback_policy: ["public"],
      test: false,
    });

    await db.muxData.create({
      data: {
        chapterId,
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id,
      },
    });

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter video updated!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const updateChapterAccess = async (
  values: z.infer<typeof ChapterSchema.chapterAccess>,
  courseId: string,
  chapterId: string,
) => {
  try {
    const validateFields = ChapterSchema.chapterAccess.safeParse(values);

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

    await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter updated!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const updateChapterDescription = async (
  values: z.infer<typeof ChapterSchema.chapterDescription>,
  courseId: string,
  chapterId: string,
) => {
  try {
    const validateFields = ChapterSchema.chapterDescription.safeParse(values);

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

    await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter updated!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const updateChapterTitle = async (
  values: z.infer<typeof ChapterSchema.chapterTitle>,
  courseId: string,
  chapterId: string,
) => {
  try {
    const validateFields = ChapterSchema.chapterTitle.safeParse(values);

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

    await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter updated!" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const reorderChapter = async (
  list: { id: string; position: number }[],
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

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter reordered" };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};

export const createChapter = async (
  values: z.infer<typeof ChapterSchema.chapterTitle>,
  courseId: string,
) => {
  try {
    const validateFields = ChapterSchema.chapterTitle.safeParse(values);

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

    revalidatePath("/teacher/course/[courseId]/chapters/[chapterId]", "page");
    return { success: "Chapter created", id: chapter.id };
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return { error: "Something went wrong!" };
  }
};
