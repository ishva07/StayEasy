import prisma from "../../config/db";

interface GetAiSearchLogParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
}

export const getAiSearchLogService = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}: GetAiSearchLogParams) => {
  const skip = (page - 1) * limit;

  const allowedSortBy = ["createdAt", "latencyMs", "outcome"] as const;
  const allowedOrder = ["asc", "desc"] as const;

  const safeSortBy = (allowedSortBy as readonly string[]).includes(sortBy)
    ? (sortBy as (typeof allowedSortBy)[number])
    : "createdAt";
  const safeOrder = (allowedOrder as readonly string[]).includes(order)
    ? (order as (typeof allowedOrder)[number])
    : "desc";

  const [data, total] = await Promise.all([
    prisma.aiSearchLog.findMany({
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeOrder },
    }),
    prisma.aiSearchLog.count(),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getAiSearchLogSummaryService = async () => {
  const [total, success, failureBreakdown] = await Promise.all([
    prisma.aiSearchLog.count(),
    prisma.aiSearchLog.count({ where: { outcome: "SUCCESS" } }),
    prisma.aiSearchLog.groupBy({
      by: ["failureReason"],
      where: { outcome: "FALLBACK" },
      _count: { failureReason: true },
    }),
  ]);

  const successRate = total > 0 ? Number(((success / total) * 100).toFixed(1)) : 0;

  const reasons = failureBreakdown.reduce<Record<string, number>>((acc, row) => {
    const key = row.failureReason ?? "unknown";
    acc[key] = row._count.failureReason;
    return acc;
  }, {});

  return { total, success, fallback: total - success, successRate, reasons };
};