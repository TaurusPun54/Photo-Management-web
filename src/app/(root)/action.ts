'use server'

import api from "@/lib/axios";

export async function getUser(token: string = "") {
    try {
        const response = await api.get('/user/me', { withCredentials: true,
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}