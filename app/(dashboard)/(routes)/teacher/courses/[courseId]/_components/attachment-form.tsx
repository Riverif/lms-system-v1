"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

import { Attachment, Course } from "@prisma/client";

import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

import { AttachmentSchema } from "@/schemas";
import {
  createAttachment,
  deleteAttachment,
} from "@/actions/teacher/attachment";
import { useRouter } from "next/navigation";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => setIsEditing((currrent) => !currrent);

  const onSubmit = (values: z.infer<typeof AttachmentSchema>) => {
    createAttachment(values, courseId).then((data) => {
      if (data.error) toast.error(data.error);
      if (data.success) {
        toast.success(data.success);
        toggleEdit();
      }
    });
  };

  const onDelete = (id: string) => {
    try {
      setDeletingId(id);
      deleteAttachment(id, courseId);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <p className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <File className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-xs">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </p>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                console.log({ url });
                onSubmit({ url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
