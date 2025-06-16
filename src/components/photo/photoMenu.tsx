"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Trash, Archive, Plus, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToAlbumDialog } from "@/components/album/addToAlbumDialog";
import { RemoveFromAlbumDialog } from "@/components/album/removeFromAlbumDialog";
import { DeletePhotoDialog } from "./deletePhotoDialog";
import { ArchiveDialog } from "@/components/archive/ArchiveDialog";
import { getAllAlbums } from "@/app/(root)/albums/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { useTheme } from "next-themes";

interface PhotoMenuProps {
  token: string;
  photo: photoInterface;
  photoList: photoInterface[];
  setPhotoList: (photos: photoInterface[]) => void;
  toArchive: boolean;
  removeFromAlbum: boolean;
  album?: albumInterface;
  restoreFromArchive?: boolean;
}

export function PhotoMenu({
  token,
  photo,
  photoList,
  setPhotoList,
  toArchive,
  removeFromAlbum,
  album,
  restoreFromArchive = false,
}: PhotoMenuProps) {
  const { resolvedTheme } = useTheme();
  const [isAddToAlbumOpen, setIsAddToAlbumOpen] = useState(false);
  const [isDeletePhotoOpen, setIsDeletePhotoOpen] = useState(false);
  const [isRemoveFromAlbumOpen, setIsRemoveFromAlbumOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const { data: albumList = [] } = useQuery({
    queryKey: ["albums"],
    queryFn: () => getAllAlbums(token, 0, 10),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button
            className={`rounded-full p-1 ${
              resolvedTheme === "dark"
                ? "text-white hover:bg-white/20"
                : "text-black hover:bg-gray-200"
            }`}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={resolvedTheme === "dark" ? "bg-black/90 border-gray-700 text-white" : ""}
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeletePhotoOpen(true);
            }}
            className={resolvedTheme === "dark" ? "hover:bg-white/10 focus:bg-white/10" : ""}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>

          {(toArchive || restoreFromArchive) && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log("Opening ArchiveDialog for photo:", photo.id); // 除錯
                setIsArchiveOpen(true);
              }}
              className={resolvedTheme === "dark" ? "hover:bg-white/10 focus:bg-white/10" : ""}
            >
              {toArchive ? (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Archive</span>
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Cancel archive</span>
                </>
              )}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsAddToAlbumOpen(true);
            }}
            className={resolvedTheme === "dark" ? "hover:bg-white/10 focus:bg-white/10" : ""}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add to album</span>
          </DropdownMenuItem>

          {removeFromAlbum && album && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsRemoveFromAlbumOpen(true);
              }}
              className={resolvedTheme === "dark" ? "hover:bg-white/10 focus:bg-white/10" : ""}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Remove from album</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAddToAlbumOpen && (
        <AddToAlbumDialog
          isOpen={isAddToAlbumOpen}
          onClose={() => setIsAddToAlbumOpen(false)}
          token={token}
          photo={photo}
        />
      )}

      {isDeletePhotoOpen && (
        <DeletePhotoDialog
          isOpen={isDeletePhotoOpen}
          onClose={() => setIsDeletePhotoOpen(false)}
          token={token}
          photo={photo}
          photoList={photoList}
          setPhotoList={setPhotoList}
        />
      )}

      {removeFromAlbum && album && isRemoveFromAlbumOpen && (
        <RemoveFromAlbumDialog
          isOpen={isRemoveFromAlbumOpen}
          onClose={() => setIsRemoveFromAlbumOpen(false)}
          token={token}
          photo={photo}
          album={album}
          photoList={photoList}
          setPhotoList={setPhotoList}
        />
      )}

      {(toArchive || restoreFromArchive) && (
        <ArchiveDialog
          token={token}
          photo={photo}
          photoList={photoList}
          setPhotoList={setPhotoList}
          toArchive={toArchive}
          isOpen={isArchiveOpen}
          onClose={() => setIsArchiveOpen(false)}
        />
      )}
    </>
  );
}