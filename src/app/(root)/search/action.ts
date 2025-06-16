'use server'

import api from "@/lib/axios";

// import { photoInterface } from "@/lib/types/photoInterface";

export async function searchPhotos(token: string = "", skip: number, limit: number, orderBy: string = 'created_at', order: string = 'desc', tag: string) {
    const response = await api.get(`/photo/search/${tag}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            skip: skip,
            limit: limit,
            orderBy: orderBy,
            order: order
        }
    });
    return {
        total_photos_count: response.data.data.total_photos_count,
        photos: response.data.data.photos
    };
}

export async function getTopTags(token: string = "", limit: number = 10) {
    const response = await api.get('/photo/top-tags', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            limit: limit
        }
    });
    return response.data.data;
}
