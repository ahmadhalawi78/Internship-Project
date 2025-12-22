"use client";

import { useState } from "react";

export default function SettingsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Mock save action
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Settings saved (mock)");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Full name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="notif"
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="notif" className="text-sm text-slate-700 font-medium">
          Email notifications
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
