"use client";

import { useRouter } from "next/navigation";
import { Users, IndianRupee, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  room: any;
  hotelId: string;
}

export function RoomCard({ room, hotelId }: RoomCardProps) {
  const router = useRouter();
  const roomImageUrl = room?.roomImage
    ? `${room.roomImage}`
    : room?.image
    ? `${room.image}`
    : room?.heroImage
    ? `${room.heroImage}`
    : null;

  return (
    <div className="rounded-2xl border border-border/70 p-4 bg-background shadow-sm hover:shadow-md hover:border-primary/40 transition-all space-y-3">
      <div className="h-36 w-full rounded-xl overflow-hidden bg-muted relative border border-border/40">
        {roomImageUrl ? (
          <img
            src={roomImageUrl}
            alt={room.name || "Room Image"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center text-muted-foreground gap-1">
            <Building2 className="h-7 w-7 text-muted-foreground/60" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Room Image</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-base text-foreground leading-snug">
          {room.name}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
          <Users className="h-3.5 w-3.5 text-primary/80" /> Max Capacity: {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
        </p>
      </div>

      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Price per night
          </span>
          <p className="text-2xl font-extrabold text-primary flex items-center">
            <IndianRupee className="h-5 w-5 mr-0.5" />
            {Number(room.price).toLocaleString()}
          </p>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm h-11 shadow-md shadow-primary/20 transition-all"
        onClick={() =>
          router.push(`/hotels/${hotelId}/rooms/${room.id}/book`)
        }
      >
        Book Now
      </Button>
    </div>
  );
}
