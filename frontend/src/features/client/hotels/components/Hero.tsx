import Image from "next/image";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <section className="relative">
<div className="relative h-[560px] sm:h-[620px] w-full overflow-hidden">
        <Image
          src="/heroSectionImage.jpg"
          alt="Luxury stays curated for you"
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlays for readability + mood */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-24 sm:pb-28 text-center">
        <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-secondary mb-4">
          Curated Collections
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-medium text-white leading-[1.1] max-w-3xl drop-shadow-sm">
          Find your next <span className="italic text-secondary">stay</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/80 max-w-md">
          Handpicked hotels and stays, chosen for character — not just convenience.
        </p>
      </div>

      {/* Glass search bar, overlapping the bottom edge of the hero image */}
      <div className="absolute -bottom-8 sm:-bottom-9 left-0 right-0 px-4 z-20">
        <SearchBar />
      </div>
    </section>
  );
}