"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { ReviewForm } from "./ReviewForm";

export function ReviewFormModal({
  bookingId,
  hotelName,
  onClose,
}: {
  bookingId: string;
  hotelName: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Review {hotelName}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <ReviewForm bookingId={bookingId} onSubmitted={onClose} />
        </div>
      </div>
    </div>
  );
}