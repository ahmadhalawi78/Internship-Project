import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-sm text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">
            Authentication Error
          </h2>
          <p className="text-sm text-slate-600">
            There was a problem authenticating your account. The authentication
            code may have expired or is invalid.
          </p>
          <div className="space-y-2">
            <Link
              href="/auth/login"
              className="block rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Try again
            </Link>
            <Link
              href="/"
              className="block text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
