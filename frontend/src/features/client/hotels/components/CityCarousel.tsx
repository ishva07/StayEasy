"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";

interface City {
  id: string;
  name: string;
  images: string;
}

export function CityCarousel({ cities }: { cities: City[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollClassName =
    "flex gap-5 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth";

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);

    const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setPageCount(pages);

    const maxScroll = el.scrollWidth - el.clientWidth;
    setActiveIndex(maxScroll <= 0 ? 0 : Math.round((el.scrollLeft / maxScroll) * (pages - 1)));
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

  const goToPage = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = pageCount <= 1 ? 0 : (idx / (pageCount - 1)) * maxScroll;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div>
      <div ref={scrollRef} className={scrollClassName}>
        {cities.map((city) => {
          const imageSrc = getImageUrl(city.images);

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

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-7 w-7 rounded-full border border-border flex items-center justify-center
                       hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-border"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-7 w-7 rounded-full border border-border flex items-center justify-center
                       hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}