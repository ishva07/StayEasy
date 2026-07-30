"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";
import { useDashboardOverview } from "../../../features/admin/dashboard/hooks/useDashboardStats";
import { useRecentActivity } from "../../../features/admin/dashboard/hooks/useGetRecentHotels";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#3b82f6",
  PENDING: "#f59e0b",
  CANCELED: "#ef4444",
  CHECKIN: "#10b981",
  CHECKOUT: "#8b5cf6",
};

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELED: "bg-red-100 text-red-700",
  CHECKIN: "bg-blue-100 text-blue-700",
  CHECKOUT: "bg-purple-100 text-purple-700",
};

export default function Dashboard() {
  const router = useRouter();
  const { stats, monthlyBookings, bookingStatus, isLoading } = useDashboardOverview();
  const { recentHotels, recentBookings } = useRecentActivity();

  const statCards = [
    { label: "Total Hotels", value: stats?.totalHotels ?? 0 },
    { label: "Total Rooms", value: stats?.totalRooms ?? 0 },
    { label: "Active Bookings", value: stats?.activeBookings ?? 0 },
    { label: "Total Revenue", value: `₹${Number(stats?.totalRevenue ?? 0).toLocaleString()}` },
  ];

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-hidden">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {isLoading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0" style={{ height: "230px" }}>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Monthly Bookings</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBookings} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Booking Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={40}
                  outerRadius={62}
                  paddingAngle={2}
                >
                  {bookingStatus.map((entry: any) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#94a3b8"} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables row - takes remaining space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Bookings</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2 font-medium text-xs">Hotel</th>
                <th className="py-2 font-medium text-xs">Room</th>
                <th className="py-2 font-medium text-xs">Check In</th>
                <th className="py-2 font-medium text-xs">Check Out</th>
                <th className="py-2 font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking: any) => (
                <tr key={booking.id} className="border-b border-gray-50">
                  <td className="py-2 text-xs">{booking.room?.hotel?.name ?? "-"}</td>
                  <td className="py-2 text-xs">{booking.room?.name ?? "-"}</td>
                  <td className="py-2 text-xs">{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td className="py-2 text-xs">{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        STATUS_BADGE[booking.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Hotels</h3>
          <div className="space-y-3">
            {recentHotels.map((hotel: any) => {
              const imageUrl = hotel.heroImage
                ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`
                : "";

              return (
                <div key={hotel.id} className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={hotel.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{hotel.name}</p>
                    <p className="text-[11px] text-gray-500">{hotel.city ?? "-"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

     
    </div>
  );
}