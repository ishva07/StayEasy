"use client";

import { useState, useEffect, useRef } from "react";

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  selectedMinPrice?: string;
  selectedMaxPrice?: string;
  onChange: (updates: Record<string, string | null>) => void;
}

export function PriceRangeSlider({
  min = 0,
  max = 25000,
  step = 500,
  selectedMinPrice,
  selectedMaxPrice,
  onChange,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(Number(selectedMinPrice) || min);
  const [localMax, setLocalMax] = useState(Number(selectedMaxPrice) || max);
  const [minInput, setMinInput] = useState(String(localMin));
  const [maxInput, setMaxInput] = useState(String(localMax));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const v = Number(selectedMinPrice) || min;
    setLocalMin(v);
    setMinInput(String(v));
  }, [selectedMinPrice]);

  useEffect(() => {
    const v = Number(selectedMaxPrice) || max;
    setLocalMax(v);
    setMaxInput(String(v));
  }, [selectedMaxPrice]);

  const commit = (nextMin: number, nextMax: number) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({
        minPrice: nextMin > min ? String(nextMin) : null,
        maxPrice: nextMax < max ? String(nextMax) : null,
      });
    }, 400);
  };

  const handleMinSlider = (value: number) => {
    const next = Math.min(value, localMax - step);
    setLocalMin(next);
    setMinInput(String(next));
    commit(next, localMax);
  };

  const handleMaxSlider = (value: number) => {
    const next = Math.max(value, localMin + step);
    setLocalMax(next);
    setMaxInput(String(next));
    commit(localMin, next);
  };

  const commitMinInput = () => {
    const parsed = Number(minInput);
    const next = Number.isNaN(parsed) ? min : Math.min(Math.max(parsed, min), localMax - step);
    setLocalMin(next);
    setMinInput(String(next));
    commit(next, localMax);
  };

  const commitMaxInput = () => {
    const parsed = Number(maxInput);
    const next = Number.isNaN(parsed) ? max : Math.max(Math.min(parsed, max), localMin + step);
    setLocalMax(next);
    setMaxInput(String(next));
    commit(localMin, next);
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div>
      <h3 className="font-semibold mb-3">Price range</h3>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center flex-1 rounded-full border-2 border-primary/30 focus-within:border-primary transition-colors px-3 py-1.5 gap-1">
          <span className="text-xs text-muted-foreground">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value.replace(/[^0-9]/g, ""))}
            onBlur={commitMinInput}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="w-full text-sm bg-transparent outline-none"
          />
        </div>
        <span className="text-muted-foreground text-sm">–</span>
        <div className="flex items-center flex-1 rounded-full border-2 border-primary/30 focus-within:border-primary transition-colors px-3 py-1.5 gap-1">
          <span className="text-xs text-muted-foreground">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value.replace(/[^0-9]/g, ""))}
            onBlur={commitMaxInput}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="w-full text-sm bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full bg-border" />
        <div
          className="absolute h-1.5 rounded-full bg-gradient-to-r from-primary/60 to-primary"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={(e) => handleMinSlider(Number(e.target.value))}
          className="range-thumb"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={(e) => handleMaxSlider(Number(e.target.value))}
          className="range-thumb"
          aria-label="Maximum price"
        />
      </div>

      {(selectedMinPrice || selectedMaxPrice) && (
        <button
          onClick={() => {
            setLocalMin(min);
            setLocalMax(max);
            setMinInput(String(min));
            setMaxInput(String(max));
            onChange({ minPrice: null, maxPrice: null });
          }}
          className="text-xs text-primary underline mt-3"
        >
          Clear
        </button>
      )}

      <style jsx>{`
        .range-thumb {
          position: absolute;
          width: 100%;
          height: 1.5rem;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: hsl(var(--primary));
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: hsl(var(--primary));
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
}