import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (!extension) return { type: "other", extension: "" };
    const type = 'image';
    return { type, extension }
}
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
