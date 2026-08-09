"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyType {
  id: string;
  name: string;
  image: string;
}

export function PropertyTypeCarousel({ types }: { types: PropertyType[] }) {
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
  }, [types]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
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
        {types.map((type) => (
          <Link
            key={type.id}
            href={`/search?propertyType=${type.id}`}
            className="min-w-[120px] sm:min-w-[140px] snap-start flex flex-col items-center gap-2 group"
          >
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-border flex items-center justify-center overflow-hidden transition-colors group-hover:border-primary">
              <Image
                src={getImageUrl(type.image)}
                alt={type.name}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <p className="text-sm font-medium capitalize">{type.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
