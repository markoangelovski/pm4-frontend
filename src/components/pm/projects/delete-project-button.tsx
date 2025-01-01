"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteProjectMutation } from "@/hooks/use-projects";

export function DeleteProjectButton({
  projectTitle,
}: {
  projectTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteProjectCall } = useDeleteProjectMutation();

  const handleDelete = () => {
    deleteProjectCall();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="ml-2"
          title={"Delete project " + projectTitle}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this project?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the project {projectTitle} and
            all associated data? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
