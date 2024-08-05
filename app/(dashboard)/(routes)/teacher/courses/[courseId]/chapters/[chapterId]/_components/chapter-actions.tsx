"use client";

import {
  deleteChapter,
  updateChapterPublish,
} from "@/actions/teacher/chapters";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = () => {
    startTransition(() => {
      updateChapterPublish(courseId, chapterId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
      });
    });
  };

  const onDelete = () => {
    startTransition(() => {
      deleteChapter(courseId, chapterId).then((data) => {
        if (data.error) toast.error(data.error);
        if (data.success) toast.success(data.success);
        router.push(`/teacher/courses/${courseId}`);
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
        <Button size="sm" disabled={disabled}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
