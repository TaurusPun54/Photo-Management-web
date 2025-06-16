"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { MoreVertical, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditAlbumDialog } from "../album/editAlbumDialog";
import { DeleteAlbumDialog } from "../album/deleteAlbumDialog";
import { albumInterface } from "@/lib/types/albumInterface";

interface AlbumMenuProps {
  token: string;
  album: albumInterface;
}

export function AlbumMenu({ token, album }: AlbumMenuProps) {
  const [isEditAlbumOpen, setIsEditAlbumOpen] = useState(false);
  const [isDeleteAlbumOpen, setIsDeleteAlbumOpen] = useState(false);
  const { resolvedTheme } = useTheme();

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
              setIsEditAlbumOpen(true);
            }}
            className={resolvedTheme === "dark" ? "hover:bg-white/10 focus:bg-white/10" : ""}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteAlbumOpen(true);
            }}
            className={resolvedTheme === "dark" ? "hover:bg-white/10 focus:bg-white/10" : ""}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAlbumDialog
        isOpen={isEditAlbumOpen}
        onClose={() => setIsEditAlbumOpen(false)}
        token={token}
        album={album}
      />

      <DeleteAlbumDialog
        isOpen={isDeleteAlbumOpen}
        onClose={() => setIsDeleteAlbumOpen(false)}
        token={token}
        album={album}
      />
    </>
  );
}