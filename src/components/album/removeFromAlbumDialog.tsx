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
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { removePhotoFromAlbum } from "@/app/(root)/albums/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";
import { UUID } from "crypto";
interface RemoveFromAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  photo: photoInterface;
  album: albumInterface;
  photoList: photoInterface[];
  setPhotoList: (photos: photoInterface[]) => void;
}

async function handleRemoveFromAlbum(
  token: string,
  albumId: UUID,
  photoId: UUID,
  photoList: photoInterface[],
  setPhotoList: RemoveFromAlbumDialogProps["setPhotoList"],
  setIsRemoving: (isRemoving: boolean) => void,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    setIsRemoving(true);
    await removePhotoFromAlbum(token, albumId, photoId);
    const updatedPhotoList = photoList.filter((p) => p.id !== photoId);
    setPhotoList(updatedPhotoList);
    queryClient.invalidateQueries({ queryKey: ["photos"], exact: false });
    setIsRemoving(false);
    onClose();
    toast.success("Photo removed from album!");
  } catch (error) {
    setIsRemoving(false);
    toast.error("Failed to remove photo from album.");
    console.error(error);
  }
}

export function RemoveFromAlbumDialog({
  isOpen,
  onClose,
  token,
  photo,
  album,
  photoList,
  setPhotoList,
}: RemoveFromAlbumDialogProps) {
  const queryClient = useQueryClient();
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <IoMdRemoveCircleOutline className="mr-2 h-4 w-4" />
          <span>Remove from album</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove this photo from {album.name}</DialogTitle>
          <DialogDescription>The photo will not be deleted.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            Are you sure you want to remove this photo from this album?
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleRemoveFromAlbum(
                token,
                album.id,
                photo.id,
                photoList,
                setPhotoList,
                setIsRemoving,
                onClose,
                queryClient
              )
            }
            disabled={isRemoving}
            type="submit"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}