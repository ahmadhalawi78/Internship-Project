"use client";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface ContactOwnerButtonProps {
    ownerEmail: string | null;
    listingTitle: string;
    ownerId: string;
    listingId: string;
}

export default function ContactOwnerButton({
    ownerEmail, // Kept for compatibility or fallback if needed, but we'll prioritize messages
    listingTitle,
    ownerId,
    listingId,
}: ContactOwnerButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        console.log("Contact button clicked", { listingId, ownerId });
        router.push(`/messages?listingId=${listingId}&ownerId=${ownerId}`);
    };

    return (
        <button
            onClick={handleClick}
            className="px-6 py-2.5 font-bold rounded-lg transition-all shadow-sm inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-105 active:scale-95"
        >
            <MessageCircle className="h-5 w-5" />
            Chat with Owner
        </button>
    );
}
