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
import { useDashboardOverview } from "../../../../features/admin/dashboard/hooks/useDashboardStats";
import { useRecentActivity } from "../../../../features/admin/dashboard/hooks/useGetRecentHotels";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";

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

export function DashboardContent() {
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
    <div className="h-full flex flex-col gap-6 p-4 overflow-hidden">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 px-5 py-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {isLoading ? "—" : card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 260 }}>
        <div className="lg:col-span-2 rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Monthly Bookings</h3>
            <span className="text-xs text-slate-500">Last 12 months</span>
          </div>
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

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Booking Status</h3>
            <span className="text-xs text-slate-500">Current</span>
          </div>
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
                  formatter={(value) =>
                    typeof value === "object"
                      ? (value as any).name ?? String(value)
                      : String(value)
                  }
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Tables row - takes remaining space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-2 rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 overflow-y-auto shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Bookings</h3>
            <span className="text-xs text-slate-500">Most recent entries</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 font-semibold text-[11px] uppercase tracking-[0.15em]">Hotel</th>
                <th className="py-3 font-semibold text-[11px] uppercase tracking-[0.15em]">Room</th>
                <th className="py-3 font-semibold text-[11px] uppercase tracking-[0.15em]">Check In</th>
                <th className="py-3 font-semibold text-[11px] uppercase tracking-[0.15em]">Check Out</th>
                <th className="py-3 font-semibold text-[11px] uppercase tracking-[0.15em]">Status</th>
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

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 overflow-y-auto shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Hotels</h3>
            <span className="text-xs text-slate-500">Latest additions</span>
          </div>
          <div className="space-y-3">
            {recentHotels.map((hotel: any) => {
              const imageUrl = hotel.heroImage
                ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`
                : "";
              const hotelCity =
                hotel.city && typeof hotel.city === "object"
                  ? hotel.city.name
                  : hotel.city;

              return (
                <div key={hotel.id} className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-muted shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={hotel.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{hotel.name}</p>
                    <p className="text-[11px] text-gray-500">{hotelCity ?? "-"}</p>
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

export default function Dashboard(){
      return (
         <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
          <DashboardContent />
        </ProtectedRoute>
        )
}