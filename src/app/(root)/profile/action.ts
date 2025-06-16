'use server'

import api from "@/lib/axios";

export async function updateUser(formData: FormData, token: string = "") {
    try {
        const response = await api.patch('/user/me', formData, {
            withCredentials: true,
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
    }
}