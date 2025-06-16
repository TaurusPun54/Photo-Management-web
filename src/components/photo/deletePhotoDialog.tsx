"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deletePhoto } from "@/app/(root)/home/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { toast } from "sonner";
import { UUID } from "crypto";

interface DeletePhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  photo: photoInterface;
  photoList: photoInterface[];
  setPhotoList: (photos: photoInterface[]) => void;
}

async function handleDeletePhoto(
  token: string,
  photoId: UUID,
  photoList: photoInterface[],
  setPhotoList: DeletePhotoDialogProps["setPhotoList"],
  setIsDeleting: (isDeleting: boolean) => void,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    setIsDeleting(true);
    await deletePhoto(token, photoId);
    setPhotoList(photoList.filter((photo) => photo.id !== photoId));
    queryClient.invalidateQueries({ queryKey: ["photos"], exact: false });
    setIsDeleting(false);
    onClose();
    toast.success("Photo deleted successfully!");
  } catch (error) {
    setIsDeleting(false);
    toast.error("Failed to delete photo.");
    console.error(error);
  }
}

export function DeletePhotoDialog({
  isOpen,
  onClose,
  token,
  photo,
  photoList,
  setPhotoList,
}: DeletePhotoDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete photo</DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            Are you sure you want to delete this photo?
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "red" }}
            onClick={() =>
              handleDeletePhoto(
                token,
                photo.id,
                photoList,
                setPhotoList,
                setIsDeleting,
                onClose,
                queryClient
              )
            }
            disabled={isDeleting}
            type="submit"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}