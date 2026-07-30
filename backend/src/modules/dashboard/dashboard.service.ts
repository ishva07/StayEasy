import prisma from "../../config/db";

export const getDashboardStatsService = async () => {
  const [totalHotels, totalRooms, activeBookings, revenueAgg] =
    await Promise.all([
      prisma.hotel.count(),
      prisma.room.count(),
      prisma.booking.count({
        where: {
          status: { in: ["CHECKIN", "CONFIRMED"] },
        },
      }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["CONFIRMED", "CHECKOUT"] } },
      }),
    ]);

  return {
    totalHotels,
    totalRooms,
    activeBookings,
    totalRevenue: revenueAgg._sum.totalPrice ?? 0,
  };
};


export const getMonthlyBookingsService = async (year?: number) => {
  const targetYear = year || new Date().getFullYear();

  const result = await prisma.$queryRaw<{ month: Date; count: bigint }[]>`
    SELECT date_trunc('month', "createdAt") as month, COUNT(*) as count
    FROM "Booking"
    WHERE EXTRACT(YEAR FROM "createdAt") = ${targetYear}
    GROUP BY date_trunc('month', "createdAt")
    ORDER BY month ASC
  `;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData = monthNames.map((name) => ({ month: name, bookings: 0 }));

  result.forEach((row) => {
    const monthIndex = new Date(row.month).getMonth();
    monthlyData[monthIndex].bookings = Number(row.count);
  });

  return monthlyData;
};


export const getBookingStatusStatsService = async () => {
  const grouped = await prisma.booking.groupBy({
    by: ["status"],
    _count: { status: true }
  });

  return grouped.map((item) => ({
    status: item.status,
    count: item._count.status
  }));
};