"use client";

import { HotelCard } from "@/features/client/hotels/components/HotelCard";
import { useCarouselScroll, CarouselControls } from "./Usecarouselscroll"; 

export function FeaturedCarousel({ hotels }: { hotels: any[] }) {
  const carousel = useCarouselScroll(hotels);

  const scrollClassName =
    "flex gap-5 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth";

  return (
    <div>
      <div ref={carousel.scrollRef} className={scrollClassName}>
        {hotels.map((hotel) => (
          <div key={hotel.id} className="min-w-[260px] sm:min-w-[280px] snap-start">
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>

      <CarouselControls {...carousel} />
    </div>
  );
}