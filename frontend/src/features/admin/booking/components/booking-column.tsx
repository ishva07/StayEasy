"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BookingStatus } from "../types/booking.type";

export interface Booking {
    id: string;
    checkIn: string;
    checkOut: string;
    totalPrice: string;
    status: BookingStatus;
    roomId: string;
    userId: string;
    room?: {
        name: string;
        hotel?: {
            name: string;
        };
        roomImage?: string;
    };
}

const validTransitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELED"],
    CONFIRMED: ["CHECKIN", "CANCELED"],
    CHECKIN: ["CHECKOUT"],
    CHECKOUT: [],
    CANCELED: [],
};

const statusColors: Record<BookingStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    CONFIRMED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    CHECKIN: "bg-green-100 text-green-800 hover:bg-green-100",
    CHECKOUT: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    CANCELED: "bg-red-100 text-red-800 hover:bg-red-100",
};

interface GetColumnsProps {
    onStatusChange: (bookingId: string, status: BookingStatus) => void;
    isUpdating?: boolean;
    canChangeStatus?: boolean;  
}

export function getBookingColumns({ onStatusChange, isUpdating, canChangeStatus = false }: GetColumnsProps): ColumnDef<Booking>[] {
    return [
        {
            accessorKey: "room",
            header: "Room / Hotel",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    {row.original.room?.roomImage ? (
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                            <img src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${row.original.room.roomImage}`} alt={row.original.room?.name ?? "room"} className="h-full w-full object-cover" />
                        </div>
                    ) : null}
                    <div>
                        <p className="font-medium">{row.original.room?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{row.original.room?.hotel?.name ?? "—"}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "checkIn",
            header: "Check-In",
            cell: ({ row }) => new Date(row.original.checkIn).toLocaleDateString(),
        },
        {
            accessorKey: "checkOut",
            header: "Check-Out",
            cell: ({ row }) => new Date(row.original.checkOut).toLocaleDateString(),
        },
        {
            accessorKey: "totalPrice",
            header: "Total Price",
            cell: ({ row }) => `₹${row.original.totalPrice}`,
        },
        {
            accessorKey: "status",
            header: "Status",
            enableSorting: false,
            cell: ({ row }) => {
                const currentStatus = row.original.status;
                const nextOptions = validTransitions[currentStatus];

                if (!canChangeStatus || nextOptions.length === 0) {
                    return <Badge className={statusColors[currentStatus]}>{currentStatus}</Badge>;
                }

                return (
                    <Select
                        value={currentStatus}
                        disabled={isUpdating}
                        onValueChange={(newStatus) => onStatusChange(row.original.id, newStatus as BookingStatus)}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue>
                                <Badge className={statusColors[currentStatus]}>{currentStatus}</Badge>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={currentStatus}>{currentStatus} (current)</SelectItem>
                            {nextOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            },
        },
    ];
}