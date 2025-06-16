'use server';

import api from "@/lib/axios";

export async function getArchivedPhotos(token: string = "", skip: number, limit: number = 10, orderBy: string = "created_at", order: string = "desc") {
    try {
        const response = await api.get(`/photo/archived`, {
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
        });
        return {
            total_photos_count: response.data.data.total_photos_count,
            photos: response.data.data.photos
        };
    } catch (error) {
        console.log(`Error when fetching archived photos: ${error}`)
        throw new Error("Failed to fetch archived photos. Please try again later."); // Propagate error 
    }
}

export async function toggleArchive(token: string = "", photoId: string) {
    try {
        const response = await api.patch(
            `/photo/${photoId}/archive`, {},
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
        throw new Error(`Error when archiving ot unarchiving photo, try later.`)
    }
}
