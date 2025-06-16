"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Lock } from "lucide-react";
import SearchBar from "@/components/search/searchbar";
import { CreateNewAlbumDialog } from "@/components/album/createNewAlbumDialog";
import { getAllAlbums } from "@/app/(root)/albums/action";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";
import { MAX_ALBUMS } from "@/lib/constants";

interface MaxAlbumsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MaxAlbumsDialog({ open, onOpenChange }: MaxAlbumsDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Maximum Albums Reached</AlertDialogTitle>
          <AlertDialogDescription>
            You have reached the maximum limit of {MAX_ALBUMS} albums. Please
            delete some albums before creating a new one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AlbumCardsProps {
  token: string;
  albumList: albumInterface[];
}

export function AlbumCards({ token, albumList }: AlbumCardsProps) {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMaxDialogOpen, setIsMaxDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["albums"],
    queryFn: () => getAllAlbums(token, 0, 10, "created_at", "desc"),
    initialData: { albums: Array.isArray(albumList) ? albumList : [], total_albums_count: Array.isArray(albumList) ? albumList.length : 0 },
    staleTime: 5 * 60 * 1000,
  });

  // 除錯：檢查 data 和 albums
  useEffect(() => {
    console.log("useQuery data:", data);
  }, [data]);

  // 確保 albums 是陣列
  const albums = Array.isArray(data?.albums) ? data.albums : []

  useEffect(() => {
    console.log("albums:", albums);
  }, [albums]);

  // Error prompt
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to load albums: ${error?.message}`);
    }
  }, [isError, error]);

  // Filter albums based on search query
//   const filteredAlbums = albums.filter(
//     (album: albumInterface) =>
//       album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (album.description &&
//         album.description.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

  const handleOpenCreateDialog = () => {
    if (albums.length >= MAX_ALBUMS) {
      setIsMaxDialogOpen(true);
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  // 僅在首次加載且無數據時顯示加載動畫
  if (isLoading && albums.length === 0 && albumList.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold">Albums</h1>
          <div className="flex gap-4">
            <SearchBar prevSearchTag={searchQuery} />
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Create Album
            </Button>
          </div>
        </div>

        <div className="mb-4 text-muted-foreground">
          {albums.length} of {MAX_ALBUMS} albums
        </div>

        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xl text-gray-500 mb-4">
              {searchQuery ? "No albums match your search" : "No albums found"}
            </p>
            <p className="text-gray-400 mb-6">
              Create an album to organize your photos
            </p>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Create Album
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album: albumInterface) => (
              <Link href={`/albums/${album.id}`} key={album.id}>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={
                        album.cover_photo_url ||
                        "/placeholder.svg?height=200&width=300"
                      }
                      width={300}
                      height={200}
                      alt={album.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {album.is_locked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="text-white h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{album.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {album.description || "No description"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateNewAlbumDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        token={token}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["albums"] });
          toast.success("Album created successfully");
        }}
      />

      <MaxAlbumsDialog
        open={isMaxDialogOpen}
        onOpenChange={setIsMaxDialogOpen}
      />
    </>
  );
}