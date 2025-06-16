'use server'

import api from "@/lib/axios";

import { photoInterface } from "@/lib/types/photoInterface";
import { UUID } from "crypto";

export async function uploadPhoto(token: string = "", file: File): Promise<photoInterface> {
    try {
        // console.log("Calling uploadPhoto with token:", token, "file:", file.name);
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/photo/upload", formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error("Failed to upload photo:", error);
        throw new Error("Failed to upload photo. Please try again later.");
    }
}

export async function restorePhoto(token: string = "", photoId: UUID) {
    try {
        const response = await api.post(`/photo/restore/${photoId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        console.error("Failed to restore photo:", error);
        throw new Error("Failed to restore photo. Please try again later.");
    }
}

export async function getRestoreTaskStatus(token: string = "", taskId: string) {
    try {
        const response = await api.get(`/photo/restore_tasks/${taskId}`, {
            headers: {
                // "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data.data
    } catch (error) {
        console.log(error)
        throw new Error("Failed to get restore task status. Please try again later.");
    }
}

export async function getAllPhotos(
    token: string = "",
    skip: number,
    limit: number,
    includeArchived: boolean = false,
    orderBy: string = "created_at",
    order: string = "desc"
): Promise<{ total_photos_count: number; photos: photoInterface[] }> {
    try {
        const response = await api.get(`/photo/all`, {
            params: {
                skip: skip,
                limit: limit,
                include_archived: includeArchived,
                order_by: orderBy,
                order: order
            },
            headers: {
                // "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return {
            total_photos_count: response.data.data.total_photos_count,
            photos: response.data.data.photos
        };
    } catch (error) {
        console.error("Failed to fetch photos:", error); // Improved logging
        throw new Error("Failed to fetch photos. Please try again later."); // Propagate error
    }
}

export async function getPresignedUrl(token: string, photoId: UUID, type: "original" | "restored" | "thumbnail") {
    try {
        const response = await api.get(`/photo/presigned/${photoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                type: type
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Failed to get presigned URL:", error);
        throw new Error("Failed to get presigned URL. Please try again later.");
    }
}

export async function toggleLiked(token: string = "", photoId: string) {
    try {
        const response = await api.patch(
            `/photo/${photoId}/like`, {},
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.log(error)
        throw new Error("Failed to like photos. Please try again later.");
    }
}

export async function deletePhoto(token: string = "", photoId: UUID) {
    try {
        await api.delete(`/photo/${photoId}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.error("Failed to delete photos:", error); // Improved logging
        throw new Error("Failed to delete photos. Please try again later."); // Propagate error
    }
}