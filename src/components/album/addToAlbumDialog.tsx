"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { BiAddToQueue } from "react-icons/bi";
import { LockAlbumSwitch } from "./lockAlbumSwitch";
import { AddToAlbumListTable } from "./albumsListTable";
import { createAlbum, addPhotoToAlbum, getAllAlbums } from "@/app/(root)/albums/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { toast } from "sonner";
import { UUID } from "crypto";

interface AddToAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  photo: photoInterface;
}

async function handleAddToNewAlbum(
  token: string,
  albumName: string,
  albumDescription: string,
  photoIds: UUID[],
  albumLocked: boolean,
  setIsAdding: (isAdding: boolean) => void,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    setIsAdding(true);
    const newAlbum = await createAlbum(token, albumName, albumDescription, albumLocked);
    await addPhotoToAlbum(token, newAlbum.id, photoIds);
    queryClient.invalidateQueries({ queryKey: ["albums"] }); // refresh albums cache
    setIsAdding(false);
    onClose();
    toast.success("Photo added to new album!");
  } catch (error) {
    setIsAdding(false);
    toast.error("Failed to add photo to album.");
    console.error(error);
  }
}

export function AddToAlbumDialog({
  isOpen,
  onClose,
  token,
  photo
}: AddToAlbumDialogProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");
  const [lockNewAlbum, setLockNewAlbum] = useState(false);

  // use useQuery to get album data
  const { data } = useQuery({
    queryKey: ["albums"],
    queryFn: () => getAllAlbums(token || "", 0, 10, "created_at", "desc"),
    staleTime: 5 * 60 * 1000,
  });

  // 確保 albums 是陣列
  const albums = Array.isArray(data?.albums) ? data.albums : []

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <BiAddToQueue className="mr-2 h-4 w-4" />
          <span>Add to album</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to album</DialogTitle>
          <DialogDescription>
            Choose or create an album for your photo.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div>
            <AddToAlbumListTable
              token={token || ""}
              photo={photo}
              albumList={albums}
              onClose={onClose}
            />
          </div>
        </ScrollArea>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="album_title" className="text-right">
              Album title
            </Label>
            <Input
              onChange={(e) => setNewAlbumName(e.target.value)}
              id="albumTitle"
              value={newAlbumName}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="album_description" className="text-right">
              Description
            </Label>
            <Input
              onChange={(e) => setNewAlbumDescription(e.target.value)}
              id="albumDescription"
              value={newAlbumDescription}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <LockAlbumSwitch
            isLocked={lockNewAlbum}
            setIsLocked={setLockNewAlbum}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleAddToNewAlbum(
                token || "",
                newAlbumName,
                newAlbumDescription,
                [photo.id],
                lockNewAlbum,
                setIsAdding,
                onClose,
                queryClient
              )
            }
            disabled={isAdding || !newAlbumName}
            type="submit"
          >
            {isAdding ? "Adding..." : "Add to Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}