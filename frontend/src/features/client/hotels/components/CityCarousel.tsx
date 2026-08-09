"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface City {
  id: string;
  name: string;
  images: string;
}

export function CityCarousel({ cities }: { cities: City[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

  function getImageUrl(path?: string | null) {
  if (!path) return "";
  return `${UPLOADS_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [cities]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
                     h-10 w-10 rounded-full bg-background border border-border shadow-md
                     flex items-center justify-center hover:bg-accent transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
                     h-10 w-10 rounded-full bg-background border border-border shadow-md
                     flex items-center justify-center hover:bg-accent transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {cities.map((city) => (
          <Link
            key={city.id}
           href={`/search?city=${city.id}`}  
            className="min-w-[160px] sm:min-w-[180px] snap-start group"
          >
            <div className="relative h-40 sm:h-48 w-full rounded-xl overflow-hidden">
              <Image
                src={getImageUrl(city.images)}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="180px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <p className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                {city.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}