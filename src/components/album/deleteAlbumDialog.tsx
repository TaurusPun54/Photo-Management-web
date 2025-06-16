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
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteAlbum } from "@/app/(root)/albums/action";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";

interface DeleteAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  album: albumInterface;
}

async function handleDeleteAlbum(
  token: string,
  albumId: string,
  setIsDeleting: (isDeleting: boolean) => void,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    setIsDeleting(true);
    await deleteAlbum(token, albumId);
    queryClient.invalidateQueries({ queryKey: ["albums"] });
    setIsDeleting(false);
    onClose();
    toast.success("Album deleted successfully!");
  } catch (error) {
    setIsDeleting(false);
    toast.error("Failed to delete album.");
    console.error(error);
  }
}

export function DeleteAlbumDialog({
  isOpen,
  onClose,
  token,
  album,
}: DeleteAlbumDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <RiDeleteBin5Line className="mr-2 h-4 w-4" />
          <span>Delete album</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete album</DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            Are you sure want to delete this album? Photos in the album will not
            be deleted.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={album.is_locked || isDeleting}
            style={{ backgroundColor: "red" }}
            onClick={() =>
              handleDeleteAlbum(token, album.id, setIsDeleting, onClose, queryClient)
            }
            type="submit"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}