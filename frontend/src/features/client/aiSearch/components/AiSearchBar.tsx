"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAiSearch } from "../hooks/useAiSearch";
import { AiSearchResult } from "../validation/aiSearch.type";

interface AiSearchBarProps {
  onResult: (result: AiSearchResult, rawQuery: string) => void;
}

const EXAMPLE_QUERIES = [
  "beach resort in Goa for 2 guests",
  "quiet villa with a pool under ₹5000",
  "pet-friendly stay near Manali this weekend",
  "4+ star hotel with free breakfast in Jaipur",
];

export function AiSearchBar({ onResult }: AiSearchBarProps) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Ask for what you want to stay in…");
  const [justSucceeded, setJustSucceeded] = useState(false);
  const exampleIndexRef = useRef(0);
  const { mutate, isPending } = useAiSearch();

  useEffect(() => {
    if (query || isFocused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaceholder(EXAMPLE_QUERIES[0]);
      return;
    }

    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = EXAMPLE_QUERIES[exampleIndexRef.current];

      if (!deleting) {
        charIndex++;
        setPlaceholder(current.slice(0, charIndex));
        if (charIndex === current.length) {
          timeoutId = setTimeout(() => {
            deleting = true;
            tick();
          }, 1400);
          return;
        }
        timeoutId = setTimeout(tick, 35);
      } else {
        charIndex--;
        setPlaceholder(current.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          exampleIndexRef.current = (exampleIndexRef.current + 1) % EXAMPLE_QUERIES.length;
          timeoutId = setTimeout(tick, 300);
          return;
        }
        timeoutId = setTimeout(tick, 20);
      }
    };

    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, [query, isFocused]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isPending) return;

    setNotice(null);

    mutate(trimmed, {
      onSuccess: (data) => {
        if (data.outcome === "FALLBACK") {
          const quotaReasons = new Set(["user_daily", "global_minute", "global_daily"]);
          if (data.reason && quotaReasons.has(data.reason)) {
            setNotice("You've reached today's AI search limit — showing keyword results instead.");
          } else {
            setNotice("Couldn't fully understand that — showing keyword results instead.");
          }
        } else {
          setJustSucceeded(true);
          setTimeout(() => setJustSucceeded(false), 900);
        }
        onResult(data, trimmed);
      },
      onError: () => {
        setNotice("Something went wrong — showing keyword results instead.");
        onResult({ outcome: "FALLBACK" }, trimmed);
      },
    });
  };

  return (
    <div className="mb-6">
      <div
        className={`ai-ring ${isPending ? "ai-ring--active" : ""} ${
          justSucceeded ? "ai-ring--success" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="relative rounded-full bg-background">
          <Sparkles
            fill="currentColor"
            strokeWidth={1.5}
            className={`ai-sparkle-icon absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${
              isPending ? "animate-spin" : "ai-sparkle"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isPending}
            className="w-full rounded-full bg-transparent pl-11 pr-24 py-3 text-sm focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isPending || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 disabled:opacity-40 flex items-center justify-center min-w-[64px]"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {notice && <p className="text-xs text-muted-foreground mt-2 px-1">{notice}</p>}

      <style jsx>{`
        .ai-ring {
          --gold: #c9a227;
          --gold-light: #f3dfa0;
          position: relative;
          border-radius: 9999px;
          padding: 1.5px;
          overflow: hidden;
          isolation: isolate;
          /* The fill itself is the animation — a soft gold band travels
             across the border continuously, like light catching brushed
             metal or satin. This is the one signature moment; everything
             else (icon, success state) stays quiet around it. */
          background: linear-gradient(
            100deg,
            rgba(201, 162, 39, 0.25) 0%,
            var(--gold-light) 45%,
            rgba(201, 162, 39, 0.25) 60%,
            rgba(201, 162, 39, 0.25) 100%
          );
          background-size: 250% 100%;
          animation: shimmer-sweep 3.5s ease-in-out infinite;
        }
        .ai-ring--active {
          animation-duration: 1.1s;
        }

        .ai-ring--success {
          animation: ring-pulse 0.9s ease-out;
        }

        /* Sparkle icon: filled gold, twinkle animation (scale + rotate +
           glow) — its own distinct moment, separate from the border sweep */
        .ai-sparkle-icon {
          color: var(--gold);
        }
        .ai-sparkle {
          animation: sparkle-twinkle 2.2s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes shimmer-sweep {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -50% 0;
          }
        }
        @keyframes ring-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.5);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(201, 162, 39, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(201, 162, 39, 0);
          }
        }
        @keyframes sparkle-twinkle {
          0%,
          100% {
            transform: translateY(-50%) scale(0.85) rotate(0deg);
            opacity: 0.65;
            filter: drop-shadow(0 0 0px var(--gold-light));
          }
          50% {
            transform: translateY(-50%) scale(1.25) rotate(12deg);
            opacity: 1;
            filter: drop-shadow(0 0 4px var(--gold-light));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-ring,
          .ai-ring--success {
            animation: none !important;
            background: rgba(201, 162, 39, 0.45);
          }
          .ai-sparkle {
            animation: none !important;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}