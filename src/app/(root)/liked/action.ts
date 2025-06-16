"use server";

import api from "@/lib/axios";

export async function getLikedPhotos(token: string = "", skip: number, limit: number = 10, orderBy: string = "created_at", order: string = "desc") {
    const response = await api.get(`/photo/liked`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            skip,
            limit,
            orderBy,
            order
        }
    });
    return {
        total_photos_count: response.data.data.total_photos_count,
        photos: response.data.data.photos
    };
}
