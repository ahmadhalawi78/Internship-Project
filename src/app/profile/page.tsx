export default function ProfilePage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Overview of your account and activity.
        </p>
      </header>

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h2 className="font-bold">Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage your personal information and contact details.
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h2 className="font-bold">Activity</h2>
          <p className="mt-2 text-sm text-slate-600">
            Recent listings, messages, and notifications.
          </p>
        </div>
      </div>
    </section>
  );
}
