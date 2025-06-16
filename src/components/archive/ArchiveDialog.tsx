"use client";

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
import { toggleArchive } from "@/app/(root)/archive/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { toast } from "sonner";
import { UUID } from "crypto";

interface ArchiveDialogProps {
  token: string;
  photo: photoInterface;
  photoList: photoInterface[];
  setPhotoList: (photos: photoInterface[]) => void;
  toArchive: boolean;
  isOpen: boolean;
  onClose: () => void;
}

async function handleToggleArchive(
  token: string,
  photoId: UUID,
  toArchive: boolean,
  photoList: photoInterface[],
  setPhotoList: (photos: photoInterface[]) => void,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    console.log(
      "Toggling archive for photo:",
      photoId,
      "toArchive:",
      toArchive
    ); // 除錯
    await toggleArchive(token, photoId);
    const updatedList = photoList.filter((photo) => photo.id !== photoId);
    setPhotoList(updatedList);
    queryClient.invalidateQueries({ queryKey: ["photos"], exact: false });
    queryClient.invalidateQueries({
      queryKey: ["photos", "album"],
      exact: false,
    });
    toast.success(toArchive ? "Photo archived!" : "Photo restored!");
    onClose();
  } catch (error) {
    toast.error(
      toArchive ? "Failed to archive photo." : "Failed to restore photo."
    );
    console.error("Archive error:", error);
  }
}

export function ArchiveDialog({
  token,
  photo,
  photoList,
  setPhotoList,
  toArchive,
  isOpen,
  onClose,
}: ArchiveDialogProps) {
  const queryClient = useQueryClient();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {toArchive
              ? "Move this photo to archive"
              : "Remove this photo from archive"}
          </DialogTitle>
          <DialogDescription>
            {toArchive
              ? "Archived photo will not show in home."
              : "This photo will show in home after removal from archive."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            Are you sure you want to{" "}
            {toArchive ? "archive" : "remove from archive"} this photo?
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Confirming archive action for photo:", photo.id); // 除錯
              handleToggleArchive(
                token,
                photo.id,
                toArchive,
                photoList,
                setPhotoList,
                onClose,
                queryClient
              );
            }}
            type="submit"
          >
            {toArchive ? "Archive" : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
