import SettingsForm from "@/frontend/components/profile/SettingsForm";

export default function ProfileSettingsPage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account preferences.
        </p>
      </header>

      <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
        <SettingsForm />
      </div>
    </section>
  );
}
