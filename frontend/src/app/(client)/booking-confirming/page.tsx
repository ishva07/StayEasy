"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";
import { Button } from "@base-ui/react";

type Status =
  | "PENDING"
  | "CONFIRMED"
  | "REFUND_PROCESSING"
  | "REFUND_COMPLETED"
  | "REFUND_FAILED";

function BookingConfirmingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const holdId = searchParams.get("holdId");

  const [status, setStatus] = useState<Status>("PENDING");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!holdId) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20;

    const poll = async () => {
      attempts++;

      try {
        const res = await api.get(
          `/bookings/confirmation-status/${holdId}`
        );

        const result = res.data.data;

        if (cancelled) return;

        setStatus(result.status);

        if (result.status === "CONFIRMED") {
          router.push(`/booking-success/${result.bookingId}`);
          return;
        }

        if (
          result.status === "REFUND_COMPLETED" ||
          result.status === "REFUND_FAILED"
        ) {
          return;
        }

        if (attempts >= maxAttempts) {
          setError(
            "This is taking longer than expected. Check 'My Bookings' shortly, or contact support if this persists."
          );
          return;
        }

        setTimeout(poll, 2000);
      } catch {
        if (!cancelled && attempts < maxAttempts) {
          setTimeout(poll, 2000);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [holdId, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      {status === "PENDING" && (
        <>
          <p className="text-lg font-semibold">
            Confirming your booking…
          </p>
          <p className="text-sm text-muted-foreground">
            This usually takes just a few seconds.
          </p>
        </>
      )}

      {status === "REFUND_PROCESSING" && (
        <>
          <p className="text-lg font-semibold">
            This room was just booked by someone else
          </p>

          <p className="text-sm text-muted-foreground">
            Your payment went through, but the room was taken moments before
            we could confirm it. We're refunding you automatically — no action
            needed.
          </p>
        </>
      )}

      {status === "REFUND_COMPLETED" && (
        <>
          <p className="text-lg font-semibold">
            Refund completed
          </p>

          <p className="text-sm text-muted-foreground">
            Your full payment has been refunded. We're sorry this room became
            unavailable.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4 backdrop:blur-sm bg-accent/70 hover:bg-accent/80 text-background">
            Browse More Rooms
          </Button>
        </>
      )}

      {status === "REFUND_FAILED" && (
        <>
          <p className="text-lg font-semibold">
            We need to fix your refund manually
          </p>

          <p className="text-sm text-muted-foreground">
            Something went wrong processing your refund automatically.
            Please contact support with this reference: {holdId}
          </p>
        </>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default function BookingConfirmingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmingContent />
    </Suspense>
  );
}