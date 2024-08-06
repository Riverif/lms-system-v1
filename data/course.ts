import { db } from "@/lib/db";

export const getCourses = async (userId: string) => {
  try {
    const courses = await db.course.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses;
  } catch (error) {
    return [];
  }
};

export const getCourseById = async (id: string) => {
  try {
    const course = await db.course.findUnique({
      where: { id },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return course;
  } catch {
    return null;
  }
};
