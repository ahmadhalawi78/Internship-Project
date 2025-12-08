"use client";

import { useState } from "react";
import { createListing } from "@/app/actions/listings";
import { useRouter } from "next/navigation";

export default function CreateListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "bartering",
    location: "",
    contact_info: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createListing(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          placeholder="What are you offering?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-2 border rounded-md"
          placeholder="Describe your item or service..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="bartering">Bartering</option>
          <option value="food">Food</option>
          <option value="services">Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          placeholder="City, region"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Contact Information
        </label>
        <input
          type="text"
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder="How should people contact you?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Listing"}
      </button>
    </form>
  );
}
