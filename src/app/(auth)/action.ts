'use server'

import api from "@/lib/axios";
import { cookies } from "next/headers";
export async function logout() {
    try {
        await api.post('/user/logout', {}, {
            withCredentials: true,
            headers: {
                "Content-type": "application/json"
            }
        });
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        (await cookies()).delete('access_token');
        (await cookies()).delete('refresh_token');
        window.location.href = '/login';
    }
}

export async function login(formData: FormData) {
    try {
        const response = await api.post('/user/login', formData, {
            withCredentials: true,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

export async function register(formData: FormData) {
    try {
        const response = await api.post('/user/register', formData, {
            withCredentials: true,
            headers: {
                "Content-type": "application/json"
            }
        });
        return response;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

export async function refresh() {
    try {
        const response = await api.post('/user/refresh', {}, { withCredentials: true });
        console.log("Refresh response:", response.status, response.headers);
        if (response.status === 200) {
            return response
        } else {
            return null;
        }
    } catch (error) {
        console.error('Refresh failed:', error);
        throw error;
    }
}
