"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";

interface PropertyType {
  id: string;
  name: string;
  image: string;
  count?: number;
}

export function PropertyTypeCarousel({ types }: { types: PropertyType[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollClassName =
    "flex gap-6 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth";

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
  }, [types]);

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