"use client";

import { useState } from "react";

type UploadImageResponse = {
    url: string;
    path: string;
};

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File): Promise<UploadImageResponse | null> => {
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            const data = (await res.json()) as
                | UploadImageResponse
                | { error?: string };

            if (!res.ok) {
                throw new Error(
                    (data as { error?: string })?.error ?? "Failed to upload image"
                );
            }

            return data as UploadImageResponse;
        } catch (err: any) {
            console.error("Image upload failed:", err);
            setError(err.message ?? "Image upload failed");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadImage,
        isUploading,
        error,
    };
}
