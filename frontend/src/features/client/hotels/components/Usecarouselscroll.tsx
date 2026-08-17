"use client";

import { useRef, useState, useEffect, RefObject } from "react";

interface UseCarouselScrollResult {
  scrollRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  pageCount: number;
  activeIndex: number;
  scroll: (direction: "left" | "right") => void;
  goToPage: (idx: number) => void;
}

export function useCarouselScroll(items: unknown[]): UseCarouselScrollResult {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

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

  return { scrollRef, canScrollLeft, canScrollRight, pageCount, activeIndex, scroll, goToPage };
}

export function CarouselControls({
  canScrollLeft,
  canScrollRight,
  pageCount,
  activeIndex,
  scroll,
  goToPage,
}: UseCarouselScrollResult) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 mt-4">
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="h-7 w-7 rounded-full border border-border flex items-center justify-center
                   hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Scroll left"
      >
        <ChevronLeftIcon />
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
        <ChevronRightIcon />
      </button>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";
function ChevronLeftIcon() {
  return <ChevronLeft className="h-3.5 w-3.5" />;
}
function ChevronRightIcon() {
  return <ChevronRight className="h-3.5 w-3.5" />;
}