import * as z from "zod";

export const CourseDescriptionSchema = z.object({
  description: z.string().min(1, {
    message: "Title is required",
  }),
});

export const CourseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

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
