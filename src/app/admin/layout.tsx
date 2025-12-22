import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
