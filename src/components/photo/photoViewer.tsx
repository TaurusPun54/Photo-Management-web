"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Info,
  Heart,
  Check,
  Loader2,
} from "lucide-react";
import { PhotoMenu } from "./photoMenu";
import { ImageCompareSlider } from "./photoCompareSlider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { photoInterface } from "@/lib/types/photoInterface";
import {
  toggleLiked,
  restorePhoto,
  getPresignedUrl,
  getRestoreTaskStatus,
} from "@/app/(root)/home/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PhotoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  photoList: photoInterface[];
  currentPhotoIndex: number;
  onNavigate: (index: number) => void;
  setPhotoList: (photos: photoInterface[]) => void;
}

export function PhotoViewer({
  isOpen,
  onClose,
  token,
  photoList,
  currentPhotoIndex,
  onNavigate,
  setPhotoList,
}: PhotoViewerProps) {
  const queryClient = useQueryClient();
  const [showInfo, setShowInfo] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [viewMode, setViewMode] = useState<"original" | "restored" | "compare">(
    "original"
  );
  const [isRestoring, setIsRestoring] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const currentPhoto = photoList[currentPhotoIndex];
  const isRestored = currentPhoto?.presigned_url_restored ? true: false;
  const isLargePhoto =
    (currentPhoto?.width ?? 0) > 1000 || (currentPhoto?.height ?? 0) > 1000;
  const [originalImageURL, setOriginalImageURL] = useState(
    currentPhoto?.presigned_url_original || ""
  );
  const [restoredImageURL, setRestoredImageURL] = useState(
    currentPhoto?.presigned_url_restored || ""
  );

  // Refresh image URLs when photo changes
  useEffect(() => {
    console.log(isRestored)
    console.log(currentPhoto)
    const refreshURLs = async () => {
      try {
        const originalURL = await getPresignedUrl(
          token,
          currentPhoto.id,
          "original"
        );
        setOriginalImageURL(originalURL);
        console.log(`original: ${originalURL}`)
        if (currentPhoto.presigned_url_restored) {
            setRestoredImageURL(currentPhoto.presigned_url_restored);
            console.log(`restored: ${currentPhoto.presigned_url_restored}`)
        }
        if (! currentPhoto.presigned_url_restored) {
          const restoredURL = await getPresignedUrl(
            token,
            currentPhoto.id,
            "restored"
          );
          setRestoredImageURL(restoredURL);
          console.log(`restored: ${restoredURL}`)
        }
      } catch (error) {
        console.error("Failed to refresh image URLs:", error);
        toast.error("Failed to load images");
      }
    };
    if (currentPhoto?.id) {
      refreshURLs();
    }
  }, [token, currentPhoto?.id, isRestored]);

  // Poll task status every 5 seconds
  useEffect(() => {
    if (!taskId || !isRestoring) return;

    const pollStatus = async () => {
      try {
        console.log("Polling task status for taskId:", taskId);
        const statusData = await getRestoreTaskStatus(token, taskId);
        console.log("Task status response:", statusData);
        if (statusData.status === "completed" && statusData.result?.photo_id) {
          // Task completed, fetch restored image URL
          const restoredURL = await getPresignedUrl(
            token,
            statusData.result.photo_id,
            "restored"
          );
          setRestoredImageURL(restoredURL);
          setPhotoList(
            photoList.map((p) =>
              p.id === currentPhoto.id
                ? { ...p, presigned_url_restored: restoredURL }
                : p
            )
          );
          queryClient.setQueryData(
            ["photos"],
            (old: photoInterface[] | undefined) =>
              old
                ? old.map((p) =>
                    p.id === currentPhoto.id
                      ? { ...p, presigned_url_restored: restoredURL }
                      : p
                  )
                : old
          );
          queryClient.invalidateQueries({ queryKey: ["photos"], exact: false });
          queryClient.invalidateQueries({
            queryKey: ["photos", "album"],
            exact: false,
          });
          setIsRestoring(false);
          setTaskId(null);
          setViewMode("restored");
          toast.success("Photo restored successfully");
        }
      } catch (error: any) {
        console.error("Failed to check task status:", error);
        toast.error("Failed to check restoration status");
        setIsRestoring(false);
        setTaskId(null);
      }
    };

    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount or taskId change
  }, [taskId, isRestoring, token, currentPhoto.id, photoList, queryClient]);

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async () => {
      console.log("Initiating restore for photo:", currentPhoto.id);
      const response = await restorePhoto(token, currentPhoto.id);
      console.log("Restore response:", response);
      return response.task_id; // Expect task_id from response
    },
    onSuccess: (taskId) => {
      console.log("Restore task queued, taskId:", taskId);
      setTaskId(taskId);
      setIsRestoring(true);
    },
    onError: (error: any) => {
      console.error("Restore error:", error);
      toast.error(`Failed to start restoration: ${error.message}`);
    },
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isRestoring) return;
      switch (e.key) {
        case "ArrowLeft":
          if (currentPhotoIndex > 0) onNavigate(currentPhotoIndex - 1);
          break;
        case "ArrowRight":
          if (currentPhotoIndex < photoList.length - 1)
            onNavigate(currentPhotoIndex + 1);
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    isRestoring,
    currentPhotoIndex,
    photoList.length,
    onNavigate,
    onClose,
  ]);

  const handleDownload = async () => {
    try {
      const type =
        viewMode === "restored" && isRestored ? "restored" : "original";
      console.log("Fetching presigned URL for:", currentPhoto.id, type);
      const url = await getPresignedUrl(token, currentPhoto.id, type);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentPhoto.file_name}${
        type === "restored" ? "_restored" : ""
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download photo");
      console.error("Download error:", error);
    }
  };

  const handleToggleLike = async () => {
    try {
      setIsLiking(true);
      await toggleLiked(token, currentPhoto.id);
      setPhotoList(
        photoList.map((p) =>
          p.id === currentPhoto.id ? { ...p, is_liked: !p.is_liked } : p
        )
      );
      queryClient.invalidateQueries({ queryKey: ["photos"], exact: false });
      toast.success(currentPhoto.is_liked ? "Photo unliked" : "Photo liked");
    } catch (error) {
      toast.error("Failed to toggle like");
      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1000) return bytes + " B";
    else if (bytes < 1000 * 1000) return (bytes / 1000).toFixed(2) + " KB";
    else return (bytes / 1000 / 1000).toFixed(2) + " MB";
  };

  if (!currentPhoto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-none [&>button]:hidden">
        <DialogTitle className="sr-only">Photo Viewer</DialogTitle>
        <div className="relative flex flex-col h-[95vh]">
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              {isRestored ? (
                <>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" /> Restored
                  </Badge>
                  <Tabs
                    value={viewMode}
                    onValueChange={(value) =>
                      setViewMode(value as "original" | "restored" | "compare")
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="original">Original</TabsTrigger>
                      <TabsTrigger value="restored">Restored</TabsTrigger>
                      <TabsTrigger value="compare">Compare</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </>
              ) : (
                <Button
                  variant="default"
                  onClick={() => restoreMutation.mutate()}
                  disabled={
                    restoreMutation.isPending || isRestoring || isLargePhoto
                  }
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Restoring...
                    </>
                  ) : isLargePhoto ? (
                    "Photo too large"
                  ) : (
                    "Restore"
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="text-white"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className={`text-white ${showInfo ? "bg-white/20" : ""}`}
              >
                <Info className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleLike}
                className="text-white"
                disabled={isLiking}
              >
                <Heart
                  className={`h-5 w-5 ${
                    currentPhoto.is_liked ? "fill-white" : ""
                  }`}
                />
              </Button>
              <PhotoMenu
                token={token}
                photo={currentPhoto}
                photoList={photoList}
                setPhotoList={setPhotoList}
                toArchive={true}
                removeFromAlbum={false}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            {isRestoring && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="text-white text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                  <p>Restoring photo, please wait...</p>
                </div>
              </div>
            )}
            {viewMode === "compare" && isRestored ? (
              <ImageCompareSlider
                originalImageURL={originalImageURL}
                restoredImageURL={restoredImageURL}
                alt={currentPhoto.file_name}
                width={currentPhoto.width}
                height={currentPhoto.height}
                aspectRatio={`${currentPhoto.width} / ${currentPhoto.height}`}
              />
            ) : (
              <Image
                src={
                  viewMode === "restored"
                    ? restoredImageURL
                    : originalImageURL
                }
                // src={restoredImageURL}
                alt={currentPhoto.file_name}
                width={currentPhoto.width}
                height={currentPhoto.height}
                className="max-h-[85vh] max-w-[90vw] object-contain"
                style={{
                  aspectRatio: `${viewMode === "restored" ? currentPhoto.width * 2 : currentPhoto.width} / ${viewMode === "restored" ? currentPhoto.height * 2 : currentPhoto.height}`,
                }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            )}
          </div>

          {currentPhotoIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(currentPhotoIndex - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {currentPhotoIndex < photoList.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(currentPhotoIndex + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {showInfo && (
            <div className="absolute right-0 top-16 bottom-0 w-80 bg-black/80 p-4 overflow-y-auto text-white">
              <h3 className="text-lg font-medium mb-4">
                {currentPhoto.file_name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Description:</span>
                  <span>
                    {currentPhoto.description
                      ? currentPhoto.description
                      : "No Description"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>File type:</span>
                  <span>{currentPhoto.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatFileSize(currentPhoto.original_file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>
                    {currentPhoto.width} × {currentPhoto.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded at:</span>
                  <span>{currentPhoto.created_at.substring(0, 10)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
