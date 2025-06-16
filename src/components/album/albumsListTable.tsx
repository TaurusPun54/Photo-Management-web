"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addPhotoToAlbum, getAllAlbums } from "@/app/(root)/albums/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";
import { UUID } from "crypto";

interface AddToAlbumListTableProps {
  onClose: () => void;
  token: string;
  photo: photoInterface;
  albumList: albumInterface[];
}

async function handleAddToAlbum(
  token: string,
  albumId: UUID,
  photoId: UUID,
  setIsAdding: (isAdding: boolean) => void,
  onClose: () => void,
  queryClient: ReturnType<typeof useQueryClient>
) {
  try {
    setIsAdding(true);
    await addPhotoToAlbum(token, albumId, [photoId]);
    queryClient.invalidateQueries({ queryKey: ["albums"] });
    queryClient.invalidateQueries({ queryKey: ["photos"], exact: false });
    setIsAdding(false);
    onClose();
    toast.success("Photo added to album!");
  } catch (error) {
    setIsAdding(false);
    toast.error("Failed to add photo to album.");
    console.error(error);
  }
}

export function AddToAlbumListTable({
  token,
  photo,
  albumList,
  onClose,
}: AddToAlbumListTableProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["albums"],
//     queryFn: () => getAllAlbums(token, 0, 10, "created_at", "desc"),
//     initialData: { albums: Array.isArray(albumList) ? albumList : [], total_albums_count: Array.isArray(albumList) ? albumList.length : 0 },
//     staleTime: 5 * 60 * 1000,
//   });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Locked</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {albumList.map((album: albumInterface) => (
          <TableRow
            className={`cursor-pointer ${isAdding ? "opacity-50" : ""}`}
            key={album.id}
            onClick={() => {
              if (!isAdding) {
                handleAddToAlbum(token, album.id, photo.id, setIsAdding, onClose, queryClient);
              }
            }}
            aria-disabled={isAdding}
          >
            <TableCell className="font-medium">{album.name}</TableCell>
            <TableCell className="font-medium">{album.created_at}</TableCell>
            <TableCell className="text-right">
              {album.is_locked ? "Yes" : "No"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}