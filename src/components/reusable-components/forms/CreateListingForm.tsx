"use client";

import { useActionState } from "react";
import { createListing } from "@/app/actions/listings";

type FormState = {
  error?: string;
  success?: boolean;
};

export default function CreateListingForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const listing = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        location: formData.get("location") as string,
        contact_info: formData.get("contact_info") as string,
        type: formData.get("type") as string,
      };

      const result = await createListing(listing);
      return result;
    },
    {}
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl mx-auto p-6">
      {state?.error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md">
          Listing created successfully! Redirecting...
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          name="type"
          defaultValue=""
          required
          disabled={isPending}
          className="w-full p-2 border rounded-md disabled:opacity-50"
        >
          <option value="">Select a type...</option>
          <option value="offer">I'm Offering</option>
          <option value="request">I'm Requesting</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          required
          disabled={isPending}
          className="w-full p-2 border rounded-md disabled:opacity-50"
          placeholder="What are you offering?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          disabled={isPending}
          className="w-full p-2 border rounded-md disabled:opacity-50"
          placeholder="Describe your item or service..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          defaultValue=""
          required
          disabled={isPending}
          className="w-full p-2 border rounded-md disabled:opacity-50"
        >
          <option value="">Select a category...</option>
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
          required
          disabled={isPending}
          className="w-full p-2 border rounded-md disabled:opacity-50"
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
          disabled={isPending}
          className="w-full p-2 border rounded-md disabled:opacity-50"
          placeholder="How should people contact you?"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Listing"}
      </button>
    </form>
  );
}
