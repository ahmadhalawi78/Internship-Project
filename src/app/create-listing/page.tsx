import { Header } from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import CreateListingForm from "@/frontend/components/reusable-components/forms/CreateListingForm";

export default function CreateListingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />

      <main className="flex-1 py-8">
        <CreateListingForm />
      </main>

      <Footer />
    </div>
  );
}
