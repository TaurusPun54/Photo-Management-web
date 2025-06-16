'use server'

import api from "@/lib/axios";
import { UUID } from "crypto";


export async function getAllAlbums(token: string = "", skip: number, limit: number, orderBy: string = 'created_at', order: string = 'desc') {
    try {
        const response = await api.get(`/album/all`, {
            params: {
                skip: skip,
                limit: limit,
                order_by: orderBy,
                order: order
            },
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })

        return {
            albums: response.data.data.albums,
            total_albums_count: response.data.data.total_albums_count
        }
    } catch (error) {
        console.log(`Error when fetching albums: ${error}`)
        throw new Error("Failed to fetch albums. Please try again later."); // Propagate error 
    }
}

export async function getAlbumById(token: string = "", albumId: UUID, skip: number, limit: number = 10, orderBy: string = 'added_at', order: string = 'desc', cover: boolean = false) {
    try {
        const response = await api.get(`/album/${albumId}`, {
            params: {
                skip: skip,
                limit: limit,
                order_by: orderBy,
                order: order,
                cover: cover
            },
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data.data
    } catch (error) {
        console.log(`Error when fetching albums: ${error}`)
        throw new Error("Failed to fetch albums. Please try again later."); // Propagate error 
    }
}

export async function createAlbum(token: string = "", name: string, description: string, is_locked: boolean, coverPhotoId?: UUID, photoIds?: UUID[]) {
    try {
        console.log("Creating album with data:", { name, description, is_locked, coverPhotoId, photoIds });
        const response = await api.post(`/album/create`, {
            name: name,
            description: description,
            cover_photo_id: coverPhotoId ?? null,
            is_locked: is_locked,
            photo_ids: photoIds ?? null
        },
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Create album response:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error when creating album:", error);
        throw new Error("Failed to create album. Please try again later.");
    }
}

export async function addPhotoToAlbum(token: string = "", albumId: UUID, photosToAdd: UUID[]) {
    try {
        const response = await api.post(`/album/${albumId}/photos`, {
            "photo_ids": photosToAdd
        },
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            photos: response.data.data.photos,
            total_photos_count: response.data.data.total_photos_count,
            ...response.data.data
        }
    } catch (error) {
        console.log(`Error when adding photo to album: ${error}`)
        throw new Error("Failed to add photos. Please try again later."); // Propagate error 
    }
}

export async function updateAlbum(token: string = "", albumId: string, name: string, description: string, is_locked: boolean, coverPhotoId: UUID) {
    try {
        const response = await api.patch(
            `/album/${albumId}`,
            {
                name: name,
                description: description,
                is_locked: is_locked,
                cover_photo_id: coverPhotoId || null

            },
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.log(`Error when updating album: ${error}`)
        throw new Error("Failed to update album. Please try again later."); // Propagate error
    }
}

export async function lockAlbum(token: string = "", albumId: UUID) {
    try {
        const response = await api.patch(`/album/lock/${albumId}`, {}, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data
    } catch (error) {
        console.log(`Error when locking or unlocking album: ${error}`)
        throw new Error("Failed to lock or unlock album. Please try again later."); // Propagate error
    }
}

export async function unlockAlbum(token: string = "", albumId: UUID) {
    try {
        const response = await api.patch(`/album/unlock/${albumId}`, {}, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.data
    } catch (error) {
        console.log(`Error when locking or unlocking album: ${error}`)
        throw new Error("Failed to lock or unlock album. Please try again later."); // Propagate error
    }
}

export async function removePhotoFromAlbum(token: string = "", albumId: UUID, photoId: UUID) {
    try {
        await api.delete(`/album/${albumId}/photos/${photoId}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(`Error when removing photo from an album: ${error}`)
        throw new Error("Failed to remove photo from album. Please try again later."); // Propagate error
    }
}

export async function deleteAlbum(token: string = "", albumId: string) {
    try {
        await api.delete(
            `/album/${albumId}`,
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.log(`Error when deleting an album: ${error}`)
        throw new Error("Failed to delete album. Please try again later."); // Propagate error
    }
}

