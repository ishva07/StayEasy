"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarouselScroll, CarouselControls } from "./Usecarouselscroll";

interface City {
  id: string;
  name: string;
  images: string;
}

export function CityCarousel({ cities }: { cities: City[] }) {
  const carousel = useCarouselScroll(cities);

  const scrollClassName =
    "flex gap-5 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth";

  return (
    <div>
      <div ref={carousel.scrollRef} className={scrollClassName}>
        {cities.map((city) => {
          const imageSrc = city.images;

          return (
            <Link
              key={city.id}
              href={`/search?city=${city.id}`}
              className="min-w-[200px] sm:min-w-[220px] snap-start group"
            >
              <div className="relative h-40 sm:h-48 w-full rounded-lg overflow-hidden border border-border">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="220px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute bottom-4 left-4 text-white font-semibold text-sm uppercase tracking-wide">
                  {city.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <CarouselControls {...carousel} />
    </div>
  );
}