"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { userInfo } from "os";
import { use } from "react";
import Stripe from "stripe";

export const checkout = async (courseId: string) => {
  try {
    const user = await currentUser();
    if (!user?.id) return { error: "Unauthorized" };

    const dbUser = await getUserById(user.id);
    if (!dbUser) return { error: "Unauthorized" };

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (purchase) {
      return { success: "Already purchase" };
    }
    if (!course) {
      return { error: "Not Found" };
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: dbUser.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: dbUser.id,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return { error: "Internal Error" };
  }
};
