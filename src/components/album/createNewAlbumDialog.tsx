"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { LockAlbumSwitch } from "./lockAlbumSwitch";
import { Check, Loader2 } from "lucide-react";
import { createAlbum } from "@/app/(root)/albums/action";
import { getAllPhotos } from "@/app/(root)/home/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";
import {
  MAX_ALBUM_NAME_LENGTH,
  DEFAULT_ALBUM_NAME,
  DEFAULT_ALBUM_DESCRIPTION,
} from "@/lib/constants";
import { UUID } from "crypto";

interface CreateAlbumProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess?: () => void;
}

export function CreateNewAlbumDialog({
  isOpen,
  onClose,
  token,
  onSuccess,
}: CreateAlbumProps) {
  const queryClient = useQueryClient();
  const [newAlbumTitle, setNewAlbumTitle] = useState(DEFAULT_ALBUM_NAME);
  const [newAlbumDescription, setNewAlbumDescription] = useState(
    DEFAULT_ALBUM_DESCRIPTION
  );
  const [lockNewAlbum, setLockNewAlbum] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<photoInterface[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "photos">("info");
  const [availablePhotos, setAvailablePhotos] = useState<photoInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 20; // Number of photos to fetch per request

  // Fetch photos for selection
  const fetchPhotos = async () => {
    if (loading) return;
    setLoading(true);
    try {
      console.log("Fetching photos with skip:", skip, "limit:", limit);
      const response = await getAllPhotos(token, skip, limit);
      const newPhotos = response.photos.filter(
        (photo) => !photo.is_archived && photo.is_processed
      );
      setAvailablePhotos((prev) => [...prev, ...newPhotos]);
      setSkip((prev) => prev + limit);
    } catch (error) {
      toast.error("Failed to load photos");
      console.error("Photo fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "photos" && availablePhotos.length === 0) {
      fetchPhotos();
    }
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100 &&
      !loading
    ) {
      fetchPhotos();
    }
  };

  const togglePhotoSelection = (photoId: UUID) => {
    setSelectedPhotos((prev) => {
      const photo = availablePhotos.find((p) => p.id === photoId);
      if (!photo) return prev;
      if (prev.some((p) => p.id === photoId)) {
        return prev.filter((p) => p.id !== photoId);
      }
      return [...prev, photo];
    });
  };

  const mutation = useMutation({
    mutationFn: async ({
      name,
      description,
      isLocked,
      coverPhotoId,
      photoIds,
    }: {
      name: string;
      description: string;
      isLocked: boolean;
      coverPhotoId?: UUID;
      photoIds?: UUID[];
    }) => {
      console.log("Mutation triggered with:", {
        name,
        description,
        isLocked,
        coverPhotoId,
        photoIds,
      });
      try {
        const response = await createAlbum(
          token,
          name,
          description,
          isLocked,
          coverPhotoId,
          photoIds
        );
        console.log("createAlbum response:", response);
        return response;
      } catch (error: any) {
        console.error("createAlbum failed:", error.message, error);
        throw new Error(`API call failed: ${error.message}`);
      }
    },
    onError: (err: any) => {
      console.error("Mutation error:", err);
      toast.error(`Failed to create album: ${err.message}`);
    },
    onSuccess: () => {
      console.log("Album created successfully, refreshing page");
      toast.success("Album created successfully");
      if (onSuccess) onSuccess();
      resetDialog();
      onClose();
      window.location.reload(); // Refresh page to reload albums
    },
  });

  const handleCreateAlbum = () => {
    console.log("Create Album button clicked");
    if (!newAlbumTitle.trim()) {
      console.log("Validation failed: Album title is empty");
      toast.error("Album title is required");
      return;
    }
    const payload = {
      name: newAlbumTitle,
      description: newAlbumDescription,
      isLocked: lockNewAlbum,
      coverPhotoId: selectedPhotos[0]?.id,
      photoIds: selectedPhotos.map((photo) => photo.id),
    };
    console.log("Submitting mutation with payload:", payload);
    mutation.mutate(payload);
  };

  const resetDialog = () => {
    console.log("Resetting dialog state");
    setNewAlbumTitle(DEFAULT_ALBUM_NAME);
    setNewAlbumDescription(DEFAULT_ALBUM_DESCRIPTION);
    setLockNewAlbum(false);
    setSelectedPhotos([]);
    setAvailablePhotos([]);
    setActiveTab("info");
    setSkip(0);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetDialog();
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Album Info</TabsTrigger>
            <TabsTrigger value="photos">
              Select Photos
              {selectedPhotos.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedPhotos.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="Enter album title"
                  maxLength={MAX_ALBUM_NAME_LENGTH}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  placeholder="Enter album description"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-start">
                <LockAlbumSwitch
                  isLocked={lockNewAlbum}
                  setIsLocked={setLockNewAlbum}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="py-4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedPhotos.length} photos selected
              </p>
              {selectedPhotos.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPhotos([])}
                >
                  Clear Selection
                </Button>
              )}
            </div>

            <ScrollArea
              className="h-[400px] rounded-md border"
              onScrollCapture={handleScroll}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2">
                {availablePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`
                      relative aspect-square rounded-md overflow-hidden cursor-pointer
                      transition-all duration-200
                      ${
                        selectedPhotos.some((p) => p.id === photo.id)
                          ? "ring-2 ring-primary ring-offset-2"
                          : "hover:opacity-90"
                      }
                    `}
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <Image
                      src={photo.presigned_url_thumbnail || "/placeholder.svg"}
                      alt={photo.file_name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                    {selectedPhotos.some((p) => p.id === photo.id) && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="col-span-full flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateAlbum}
            disabled={mutation.isPending || !newAlbumTitle.trim()}
          >
            Create Album
            {selectedPhotos.length > 0 &&
              ` with ${selectedPhotos.length} photos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
