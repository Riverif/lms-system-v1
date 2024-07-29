"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { SignUpSchema } from "@/schemas";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const validateFields = SignUpSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalide fields!" };
  }

  const { email, password, username } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return { success: "Email sent!" };
};
