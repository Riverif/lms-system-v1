import * as z from "zod";

export const ChapterSchema = {
  chapterTitle: z.object({
    title: z.string().min(1),
  }),
  chapterDescription: z.object({
    description: z.string().min(1),
  }),
  chapterAccess: z.object({
    isFree: z.boolean().default(false),
  }),
};

export const AttachmentSchema = z.object({
  url: z.string().min(1),
});

export const CourseSchema = {
  courseTitle: z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
  }),
  courseDescription: z.object({
    description: z.string().min(1, {
      message: "Title is required",
    }),
  }),
  courseImage: z.object({
    imageUrl: z.string().min(1, {
      message: "Title is required",
    }),
  }),
  courseCategory: z.object({
    categoryId: z.string().min(1),
  }),
  coursePrice: z.object({
    price: z.coerce.number(),
  }),
};

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const SignUpSchema = z.object({
  username: z.string().min(1, {
    message: "username is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
