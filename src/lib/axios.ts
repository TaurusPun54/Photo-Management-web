"use server";

import axios from 'axios';
import { readFileSync } from 'fs';
import { baseUrl } from '@/lib/utils';
import { Agent } from 'https';
import { refresh } from '@/app/(auth)/action';

const ca = readFileSync('certificates/rootCA.pem');
const agent = new Agent({ ca });

const api = axios.create({
    baseURL: baseUrl, // Replace with your backend base URL
    withCredentials: true, // Ensure cookies (e.g., refresh_token) are sent with requests
    httpsAgent: agent,
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/user/refresh') {
            originalRequest._retry = true; // Prevent infinite loops
            try {
                // Call the refresh token endpoint
                const refreshResponse = await refresh();

                if (refreshResponse?.status === 200) {
                    // const newAccessToken = (await cookies()).get("access_token")?.value;
                    // Update the original request with the new token
                    // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

export default api;