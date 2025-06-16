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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaRegEdit } from "react-icons/fa";
import { updateAlbum } from "@/app/(root)/albums/action";
import { LockAlbumSwitch } from "./lockAlbumSwitch";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";
import { UUID } from "crypto";

interface EditAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  album: albumInterface;
}

async function handleEditAlbum(
  token: string,
  albumId: string,
  albumName: string,
  albumDescription: string,
  albumLocked: boolean,
  albumCoverPhotoId: UUID,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    await updateAlbum(token, albumId, albumName, albumDescription, albumLocked, albumCoverPhotoId);
    queryClient.invalidateQueries({ queryKey: ["albums"] });
    onClose();
    toast.success("Album updated successfully!");
  } catch (error) {
    toast.error("Failed to update album.");
    console.error(error);
  }
}

export function EditAlbumDialog({
  isOpen,
  token,
  album,
  onClose,
}: EditAlbumDialogProps) {
  const queryClient = useQueryClient();
  const [albumName, setAlbumName] = useState(album.name);
  const [albumDescription, setAlbumDescription] = useState(album.description);
  const [albumLocked, setAlbumLocked] = useState(album.is_locked || false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FaRegEdit className="mr-2 h-4 w-4" />
          <span>Edit album</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit album</DialogTitle>
          <DialogDescription>Edit album as you want.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="album_title" className="text-right">
              Album title
            </Label>
            <Input
              onChange={(e) => setAlbumName(e.target.value)}
              id="albumTitle"
              value={albumName}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="album_description" className="text-right">
              Description
            </Label>
            <Input
              onChange={(e) => setAlbumDescription(e.target.value)}
              id="albumDescription"
              value={albumDescription}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <LockAlbumSwitch
            isLocked={albumLocked}
            setIsLocked={setAlbumLocked}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "blue" }}
            onClick={() =>
              handleEditAlbum(
                token,
                album.id,
                albumName,
                albumDescription,
                albumLocked,
                album.cover_photo_id,
                onClose,
                queryClient
              )
            }
            disabled={!albumName}
            type="submit"
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}