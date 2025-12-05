"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/app/actions/listings";

export default function CreateListingForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "items",
        type: "offer",
        status: "active",
        city: "",
        area: "",
        location: "",
        contact_info: "",
        is_urgent: false,
        urgency: "normal",
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const target = e.target;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [target.name]: target.checked,
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [target.name]: target.value,
        }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setImages(files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const uploadImages = async () => {
        const uploaded: { url: string; path: string }[] = [];

        for (const file of images) {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to upload image");
            }

            uploaded.push({
                url: data.url,
                path: data.path,
            });
        }

        return uploaded;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const uploaded = await uploadImages();

            const formattedImages = uploaded.map((img, i) => ({
                image_url: img.url,
                path: img.path,
                position: i + 1,
            }));

            const result = await createListing({
                ...formData,
                images: formattedImages,
            });

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Create a New Listing</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* TITLE */}
                <div>
                    <label className="font-medium block mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full border rounded p-2"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="font-medium block mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        className="w-full border rounded p-2"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* CATEGORY */}
                <div>
                    <label className="font-medium block mb-1">Category</label>
                    <select
                        name="category"
                        className="w-full border rounded p-2"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="items">Items</option>
                        <option value="food">Food</option>
                        <option value="services">Services</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* TYPE */}
                <div>
                    <label className="font-medium block mb-1">Type</label>
                    <select
                        name="type"
                        className="w-full border rounded p-2"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="offer">Offer</option>
                        <option value="request">Request</option>
                    </select>
                </div>

                {/* STATUS */}
                <div>
                    <label className="font-medium block mb-1">Status</label>
                    <select
                        name="status"
                        className="w-full border rounded p-2"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="active">Active</option>
                        <option value="reserved">Reserved</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* URGENCY BOOLEAN */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="is_urgent"
                        checked={formData.is_urgent}
                        onChange={handleChange}
                    />
                    <label className="font-medium">Mark as urgent</label>
                </div>

                {/* URGENCY ENUM */}
                <div>
                    <label className="font-medium block mb-1">Urgency Level</label>
                    <select
                        name="urgency"
                        className="w-full border rounded p-2"
                        value={formData.urgency}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                {/* CITY */}
                <div>
                    <label className="font-medium block mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        className="w-full border rounded p-2"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>

                {/* AREA */}
                <div>
                    <label className="font-medium block mb-1">Area</label>
                    <input
                        type="text"
                        name="area"
                        className="w-full border rounded p-2"
                        value={formData.area}
                        onChange={handleChange}
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="font-medium block mb-1">Location (Optional)</label>
                    <input
                        type="text"
                        name="location"
                        className="w-full border rounded p-2"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                {/* Contact Info */}
                <div>
                    <label className="font-medium block mb-1">Contact Info</label>
                    <input
                        type="text"
                        name="contact_info"
                        className="w-full border rounded p-2"
                        value={formData.contact_info}
                        onChange={handleChange}
                    />
                </div>

                {/* IMAGES */}
                <div>
                    <label className="font-medium block mb-2">Images</label>

                    <input type="file" accept="image/*" multiple onChange={handleImageSelect} />

                    {/* PREVIEWS */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                            {previews.map((src, index) => (
                                <div
                                    key={index}
                                    className="border rounded overflow-hidden bg-gray-100"
                                >
                                    <img
                                        src={src}
                                        alt="preview"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Listing"}
                </button>
            </form>
        </div>
    );
}
