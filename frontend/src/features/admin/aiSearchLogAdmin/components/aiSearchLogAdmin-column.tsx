"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AiSearchLog {
  id: string;
  rawQuery: string;
  outcome: "SUCCESS" | "FALLBACK";
  failureReason: string | null;
  latencyMs: number | null;
  userId: string | null;
  createdAt: string;
}

export function getAiSearchLogColumns(): ColumnDef<AiSearchLog>[] {
  return [
    {
      accessorKey: "rawQuery",
      header: "Query",
      cell: ({ row }) => (
        <TooltipProvider delay={200}>
          <Tooltip>
            <TooltipTrigger>
              <span className="block max-w-xs cursor-default truncate">
                {row.original.rawQuery}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm whitespace-normal">
              {row.original.rawQuery}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      cell: ({ row }) => {
        const outcome = row.original.outcome;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              outcome === "SUCCESS"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {outcome}
          </span>
        );
      },
    },
    {
      accessorKey: "failureReason",
      header: "Reason",
      cell: ({ row }) => row.original.failureReason ?? "—",
    },
    {
      accessorKey: "latencyMs",
      header: "Latency",
      cell: ({ row }) => (row.original.latencyMs != null ? `${row.original.latencyMs} ms` : "—"),
    },
    {
      accessorKey: "createdAt",
      header: "Time",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];
}