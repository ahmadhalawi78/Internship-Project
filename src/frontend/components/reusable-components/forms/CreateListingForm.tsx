"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/app/actions/listings";

export default function CreateListingForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    status: "active",
    city: "",
    area: "",
    location: "",
    is_urgent: false,
    trade_requirements: "",
  });

  const [step, setStep] = useState(0);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

      const res = await fetch("/api/auth/upload-image", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to upload image";
        try {
          const data = JSON.parse(errorText);
          errorMessage = data.error || errorMessage;
        } catch {
          errorMessage = `Upload failed with status ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      uploaded.push({
        url: data.url,
        path: data.path,
      });
    }

    return uploaded;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (images.length === 0) {
      setError("Please select at least one image for your listing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

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

      // Success - show confirmation message instead of redirecting
      setSuccess(
        "Your listing has been submitted and is pending approval. You'll be notified once it's approved!"
      );
      setLoading(false);

      // Optionally redirect after a delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 3000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
      setLoading(false);
    }
  };

  const totalSteps = 3;

  const next = () => {
    // basic validation per step
    if (step === 0) {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Please provide title and description.");
        return;
      }
      if (!formData.category) {
        setError("Please select a category.");
        return;
      }
      if (!formData.type) {
        setError("Please select a type.");
        return;
      }
    }
    if (step === 1) {
      if (!formData.city.trim()) {
        setError("Please provide a city.");
        return;
      }
    }

    setError(null);
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h2 className="text-2xl font-semibold mb-2">Create a New Listing</h2>
        <p className="text-sm text-slate-500 mb-4">
          Share what you have or need with your community.
        </p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {["Details", "Location", "Images"].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                    idx === step
                      ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {idx + 1}
                </div>
                <div
                  className={`hidden sm:block ${
                    idx === step
                      ? "text-slate-900 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </div>
                {idx < totalSteps - 1 && (
                  <div className="flex-1 h-px bg-slate-200 mx-3" />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            Step {step + 1} of {totalSteps}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              You'll be redirected to the home page shortly...
            </p>
          </div>
        )}

        <form
          onSubmit={
            step === totalSteps - 1
              ? handleSubmit
              : (e) => {
                  e.preventDefault();
                  next();
                }
          }
          className="space-y-6"
        >
          {step === 0 && (
            <div>
              <div className="mb-4">
                <label className="font-medium block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-3 border rounded-lg border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="font-medium block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  className="w-full p-3 border rounded-lg border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="font-medium block mb-1">
                  What would you like in return?{" "}
                  <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  name="trade_requirements"
                  rows={3}
                  className="w-full p-3 border rounded-lg border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
                  value={formData.trade_requirements}
                  onChange={handleChange}
                  placeholder="Describe what you'd like to receive in exchange (e.g., 'Looking for fresh vegetables', 'Would trade for books', etc.)"
                />
                <p className="text-xs text-slate-500 mt-1">
                  This helps other users understand what you're looking for in
                  exchange.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium block mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category...</option>
                    <option value="items">Items</option>
                    <option value="food">Food</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium block mb-1">Type</label>
                  <select
                    name="type"
                    className="w-full p-2 border rounded-lg border-slate-200"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a type...</option>
                    <option value="offer">Offer</option>
                    <option value="request">Request</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  name="is_urgent"
                  id="is_urgent"
                  checked={formData.is_urgent}
                  onChange={handleChange}
                />
                <label
                  htmlFor="is_urgent"
                  className="font-medium cursor-pointer"
                >
                  Mark as urgent
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div>
                <label className="font-medium block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  className="w-full p-3 border rounded-lg border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="font-medium block mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  className="w-full p-3 border rounded-lg border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="font-medium block mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full p-3 border rounded-lg border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="font-medium block mb-4">Images</label>

              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  id="file-input"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    const fileInput = document.getElementById(
                      "file-input"
                    ) as HTMLInputElement;
                    fileInput?.click();
                  }}
                  className="inline-block px-4 py-2 rounded-md bg-linear-to-r from-blue-600 to-emerald-600 text-white shadow-md hover:opacity-95 cursor-pointer"
                >
                  Choose Images
                </button>
                <div className="text-sm text-slate-500 mt-2">
                  {images.length > 0
                    ? `${images.length} image${
                        images.length !== 1 ? "s" : ""
                      } selected (max 6)`
                    : "You can add up to 6 images."}
                </div>
              </div>

              {previews.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-3 text-slate-700">
                    Image Preview
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previews.map((src, index) => (
                      <div
                        key={index}
                        className="border rounded overflow-hidden bg-gray-100 relative group"
                      >
                        <img
                          src={src}
                          alt={`preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Images help your listing stand out.
                  They will be displayed to other users when they view your
                  listing.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="px-4 py-2 border rounded-md text-slate-700"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex-1" />

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-4 py-2 rounded-md bg-linear-to-r from-blue-600 to-emerald-600 text-white shadow-md hover:opacity-95"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-linear-to-r from-emerald-600 to-blue-600 text-white shadow-md hover:opacity-95 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
