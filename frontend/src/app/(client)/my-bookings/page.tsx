"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useMyBookings } from "@/features/client/booking/hooks/useMyBookings";
import { useCancelBooking } from "@/features/client/booking/hooks/useCancelBooking";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { ReviewFormModal } from "@/features/client/reviews/components/ReviewFormModal";

import {
  CalendarDays,
  BedDouble,
  Users,
  Clock3,
  CheckCircle2,
  LogIn,
  LogOut,
  XCircle,
  Star,
} from "lucide-react";


const STATUS_CONFIG: Record<
  string,
  {
    text: string;
    dot: string;
    textColor: string;
    bgColor: string;
    icon: any;
  }
> = {
  PENDING: {
    text: "Pending",
    dot: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: Clock3,
  },

  CONFIRMED: {
    text: "Confirmed",
    dot: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: CheckCircle2,
  },

  CHECKIN: {
    text: "Checked in",
    dot: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: LogIn,
  },

  CHECKOUT: {
    text: "Completed",
    dot: "bg-slate-500",
    textColor: "text-slate-700",
    bgColor: "bg-slate-50",
    icon: LogOut,
  },

  CANCELED: {
    text: "Cancelled",
    dot: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}



function BookingCard({
  booking,
  onCancel,
  onReview,
  onViewHotel,
}: {
  booking: any;
  onCancel: (booking: any) => void;
  onReview: (booking: any) => void;
  onViewHotel: (booking: any) => void;
}) {
  const status =
    STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;

  const imageUrl = booking.room?.roomImage
    ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${booking.room.roomImage}`
    : "";

  const isCompleted = booking.status === "CHECKOUT";
  const isPending = booking.status === "PENDING";
  const hasReview = !!booking.review;

  return (
    <article
      className="
        overflow-hidden
        rounded-xl
        border
        border-[#d9d5cc]
        bg-white
        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
        transition-all
        duration-200
        hover:border-[#c8c2b7]
        hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]
      "
    >
      
      <div className="p-2.5">
        <div className="flex items-center gap-3">
          <div
            className="
              h-[68px]
              w-[76px]
              shrink-0
              overflow-hidden
              rounded-lg
              bg-[#eeeae3]
            "
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={booking.room?.hotel?.name ?? "Hotel"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BedDouble className="h-5 w-5 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Information */}
          <div className="min-w-0 flex-1">
            {/* Hotel name + status */}
            <div className="flex items-center gap-2">
              <h2
                className="
                  min-w-0
                  truncate
                  font-display
                  text-[18px]
                  font-medium
                  leading-tight
                  text-[#191814]
                "
              >
                {booking.room?.hotel?.name ?? "Hotel"}
              </h2>

              {/* Status */}
              <span
                className={`
                  inline-flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  px-2
                  py-[3px]
                  text-[11px]
                  font-medium
                  ${status.bgColor}
                  ${status.textColor}
                `}
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${status.dot}
                  `}
                />

                {status.text}
              </span>
            </div>

            {/* Booking metadata */}
            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-1
                text-[12px]
                leading-none
                text-[#5f5b54]
              "
            >
              {booking.room?.name && (
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5 text-[#777168]" />
                  {booking.room.name}
                </span>
              )}

              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-[#777168]" />
                {formatDate(booking.checkIn)} –{" "}
                {formatDate(booking.checkOut)}
              </span>

              {booking.room?.capacity && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#777168]" />
                  {booking.room.capacity}{" "}
                  {booking.room.capacity === 1 ? "adult" : "adults"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          flex
          min-h-[40px]
          items-center
          justify-between
          border-t
          border-[#e5e1d9]
          bg-[#faf9f6]
          px-2.5
          py-1.5
        "
      >
        {/* Price / booking date */}
        <div className="flex items-center">
          {booking.totalPrice ? (
            <p
              className="
                font-display
                text-[16px]
                font-semibold
                tracking-tight
                text-[#164f3d]
              "
            >
              ₹{Number(booking.totalPrice).toLocaleString()}
            </p>
          ) : (
            <p className="text-[11px] text-[#6d685f]">
              Booked on {formatDate(booking.createdAt)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {booking.totalPrice && (
            <p className="hidden text-[11px] text-[#6d685f] sm:block">
              Booked on {formatDate(booking.createdAt)}
            </p>
          )}

          {/* Cancel */}
          {isPending && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="
                rounded-md
                px-2
                py-1.5
                text-[11px]
                font-medium
                text-[#817a70]
                transition-colors
                hover:bg-red-50
                hover:text-red-600
              "
            >
              Cancel booking
            </button>
          )}

          {isCompleted && !hasReview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onReview(booking)}
              className="
                h-7
                rounded-full
                border-[#b9a46f]
                bg-transparent
                px-3
                text-[11px]
                font-medium
                text-[#8c7644]
                hover:bg-[#f8f3e8]
              "
            >
              <Star className="mr-1.5 h-3 w-3 fill-[#b9a46f] text-[#b9a46f]" />
              Leave a review
            </Button>
          )}

          {isCompleted && hasReview && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#6d685f]">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Reviewed
            </span>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => onViewHotel(booking)}
            className="
              h-7
              rounded-full
              bg-[#14513e]
              px-3.5
              text-[11px]
              font-medium
              text-white
              shadow-none
              hover:bg-[#0f4233]
            "
          >
            View hotel
          </Button>
        </div>
      </div>
    </article>
  );
}


function MyBookingsContent() {
  const router = useRouter();

  const { data, isLoading } = useMyBookings();

  const {
    cancelBooking,
    isPending: isCancelling,
  } = useCancelBooking();

  const [bookingToCancel, setBookingToCancel] = useState<any>(null);
  const [bookingToReview, setBookingToReview] = useState<any>(null);

  const bookings = data?.data ?? [];


  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;

    cancelBooking(bookingToCancel.id, {
      onSuccess: () => {
        setBookingToCancel(null);
      },
    });
  };


  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fdfcf9]">
        <div className="mx-auto w-full max-w-[510px] px-4 py-12">
          {/* Header skeleton */}
          <div className="mb-7 space-y-2">
            <div className="h-9 w-48 animate-pulse rounded-md bg-[#ebe8e1]" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-[#ebe8e1]" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-[123px]
                  animate-pulse
                  rounded-xl
                  border
                  border-[#e5e1d9]
                  bg-white
                "
              />
            ))}
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#fdfcf9]">
      <div className="mx-auto w-full max-w-[510px] px-4 pb-12 pt-8 sm:pt-12">

        <header className="mb-7">
          <h1
            className="
              font-display
              text-[32px]
              font-medium
              leading-[1.05]
              tracking-[-0.02em]
              text-[#171612]
            "
          >
            My Bookings
          </h1>

          <p className="mt-2 text-[14px] text-[#68645d]">
            Manage your upcoming and past reservations.
          </p>
        </header>

        {bookings.length === 0 ? (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-[#d8d3c9]
              bg-white
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#eef5f1]
              "
            >
              <CalendarDays className="h-5 w-5 text-[#14513e]" />
            </div>

            <h2 className="mt-4 font-display text-[17px] font-medium text-[#191814]">
              No bookings yet
            </h2>

            <p className="mx-auto mt-1 max-w-xs text-[13px] leading-5 text-[#777168]">
              When you book a stay, it&apos;ll show up here with all
              your reservation details.
            </p>

            <Button
              type="button"
              onClick={() => router.push("/")}
              className="
                mt-5
                h-9
                rounded-full
                bg-[#14513e]
                px-5
                text-xs
                text-white
                hover:bg-[#0f4233]
              "
            >
              Browse hotels
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking: any) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={setBookingToCancel}
                onReview={setBookingToReview}
                onViewHotel={(currentBooking) =>
                  router.push(
                    `/hotels/${currentBooking.room?.hotelId}`
                  )
                }
              />
            ))}
          </div>
        )}


        <ConfirmDialog
          open={!!bookingToCancel}
          onOpenChange={(open) => {
            if (!open) {
              setBookingToCancel(null);
            }
          }}
          title="Cancel this booking?"
          description="This action cannot be undone. Your booking will be permanently cancelled."
          loading={isCancelling}
          onConfirm={handleConfirmCancel}
        />


        {bookingToReview && (
          <ReviewFormModal
            bookingId={bookingToReview.id}
            hotelName={
              bookingToReview.room?.hotel?.name ?? "this stay"
            }
            onClose={() => setBookingToReview(null)}
          />
        )}
      </div>
    </main>
  );
}


export default function MyBookingsPage() {
  return (
    <ProtectedRoute
      requiredPermission={PERMISSIONS.VIEW_MY_BOOKING}
    >
      <MyBookingsContent />
    </ProtectedRoute>
  );
}