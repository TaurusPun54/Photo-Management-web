"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { MAX_FILES, MAX_FILE_SIZE } from "@/lib/constants";
import { uploadPhoto } from "./action";

import { photoInterface } from "@/lib/types/photoInterface";
import { userInterface } from "@/lib/types/userInterface";

// interface UploadResponse {
//   code: number;
//   msg: string;
//   data: photoInterface;
// }

// async function uploadPhoto(token: string, file: File): Promise<photoInterface> {
//   const formData = new FormData();
//   formData.append("photo", file);
//   const response = await fetch("/api/photos/upload", {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//     body: formData,
//   });
//   const result: UploadResponse = await response.json();
//   if (result.code !== 200) throw new Error(result.msg);
//   return result.data;
// }

export default function PhotoUploader({
  token,
  onUploadSuccess,
}: {
  token: string;
  onUploadSuccess: () => void;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      const results: photoInterface[] = [];
      for (let i = 0; i < files.length; i++) {
        console.log(`Uploading photo ${i+1}`)
        const result = await uploadPhoto(token, files[i]);
        results.push(result);
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      return results;
    },
    onMutate: async (files) => {
      await queryClient.cancelQueries({ queryKey: ["photos", "gallery"] });
      const previousData = queryClient.getQueryData(["photos", "gallery"]);
      const tempUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(tempUrls);
      queryClient.setQueryData(["photos", "gallery"], (old: any) => {
        const newPhotos = files.map((file, index) => ({
          id: `temp-${Date.now()}-${index}`,
          file_name: file.name,
          presigned_url_thumbnail: tempUrls[index],
          width: 0,
          height: 0,
          mime_type: file.type,
          format: file.type.split("/")[1]?.toUpperCase() || "",
          original_file_size: file.size,
          created_at: new Date().toISOString(),
          is_liked: false,
          is_archived: false,
          is_processed: false,
          tags: [],
        }));
        return {
          pages: [
            {
              photos: [...newPhotos, ...(old?.pages[0]?.photos || [])],
              total_photos_count:
                (old?.pages[0]?.total_photos_count || 0) + newPhotos.length,
              nextSkip: old?.pages[0]?.nextSkip || newPhotos.length,
            },
            ...(old?.pages.slice(1) || []),
          ],
          pageParams: old?.pageParams || [0],
        };
      });
      return { previousData, tempUrls };
    },
    onError: (error: Error, files, context) => {
      queryClient.setQueryData(["photos", "gallery"], context?.previousData);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setUploadProgress(0);
      toast.error(`Failed to upload photos: ${error.message}`);
    },
    onSuccess: (results, files, context) => {
      const totalSize = results.reduce(
        (sum: number, photo: photoInterface) =>
          sum + (photo.original_file_size || 0),
        0
      );
      queryClient.setQueryData(["user"], (old: userInterface | undefined) =>
        old ? { ...old, storage_used: old.storage_used + totalSize } : old
      );
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setSelectedFiles([]);
      setUploadProgress(0);
      toast.success(`Uploaded ${results.length} photos successfully`);
      onUploadSuccess();
    },
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addFiles(Array.from(files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (selectedFiles.length + imageFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} photos at once.`);
      return;
    }
    const validFiles = imageFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" exceeds 10MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const url = prev[index];
      URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        id="photo-upload"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {selectedFiles.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <h3 className="text-lg font-medium">
              Drag photos here or click to browse
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload up to {MAX_FILES} photos (max 10MB each)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFiles.map((file, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Image
                      src={previewUrls[index] || "/placeholder.svg"}
                      alt={file.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs truncate" title={file.name}>
                    {file.name}
                  </p>
                </CardContent>
              </Card>
            ))}
            {selectedFiles.length < MAX_FILES && (
              <Card
                className="overflow-hidden cursor-pointer border-dashed"
                onClick={triggerFileInput}
              >
                <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                  <div className="aspect-square rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-xs text-center">Add more</p>
                </CardContent>
              </Card>
            )}
          </div>
          {mutation.isPending ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading {selectedFiles.length}{" "}
                {selectedFiles.length === 1 ? "photo" : "photos"}...{" "}
                {Math.round(uploadProgress)}%
              </p>
            </div>
          ) : (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFiles([]);
                  previewUrls.forEach((url) => URL.revokeObjectURL(url));
                  setPreviewUrls([]);
                }}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                //   console.log("Upload button clicked", selectedFiles);
                  mutation.mutate(selectedFiles);
                }}
                disabled={selectedFiles.length === 0 || mutation.isPending}
              >
                Upload {selectedFiles.length}{" "}
                {selectedFiles.length === 1 ? "photo" : "photos"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
