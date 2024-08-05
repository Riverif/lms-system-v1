"use client";

import { deleteCourse, updateCoursePublish } from "@/actions/teacher/course";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const confetti = useConfettiStore();

  const onClick = () => {
    startTransition(() => {
      updateCoursePublish(courseId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
        confetti.onOpen();
      });
    });
  };

  const onDelete = () => {
    startTransition(() => {
      deleteCourse(courseId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
        router.push(`/teacher/courses`);
      });
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isPending}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isPending}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
