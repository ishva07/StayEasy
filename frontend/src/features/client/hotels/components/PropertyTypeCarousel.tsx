"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";
import { useCarouselScroll, CarouselControls } from "./Usecarouselscroll"; 

interface PropertyType {
  id: string;
  name: string;
  image: string;
  count?: number;
}

export function PropertyTypeCarousel({ types }: { types: PropertyType[] }) {
  const carousel = useCarouselScroll(types);

  const scrollClassName =
    "flex gap-6 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth";

  return (
    <div>
      <div ref={carousel.scrollRef} className={scrollClassName}>
        {types.map((type) => {
          const imageSrc = getImageUrl(type.image);

          return (
            <Link
              key={type.id}
              href={`/search?propertyType=${type.id}`}
              className="min-w-[110px] sm:min-w-[128px] snap-start flex flex-col items-center gap-2.5 group"
            >
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-border bg-muted overflow-hidden transition-colors duration-300 group-hover:border-primary">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={type.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium capitalize">{type.name}</p>
                {typeof type.count === "number" && (
                  <p className="text-[11px] text-muted-foreground">{type.count}+ stays</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <CarouselControls {...carousel} />
    </div>
  );
}