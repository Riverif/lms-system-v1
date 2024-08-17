"use client";

import { checkout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      checkout(courseId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
        if (data.url) window.location.assign(data.url);
      });
    });
  };

  return (
    <Button
      size="sm"
      className="w-full md:w-auto"
      onClick={onClick}
      disabled={isPending}
    >
      Enroll {formatPrice(price)}
    </Button>
  );
};
