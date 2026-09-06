import redisClient from "../../config/redis";

const HOLD_TTL_SECONDS = 600; 

function nightKeys(roomId: string, checkIn: Date, checkOut: Date): string[] {
  const keys: string[] = [];
  const cursor = new Date(checkIn);
  while (cursor < checkOut) {
    const dateStr = cursor.toISOString().split("T")[0]; 
    keys.push(`hold:${roomId}:${dateStr}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

export interface HoldResult {
  acquired: boolean;
  holdId?: string;
}

export async function acquireBookingHold(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  userId: string,
): Promise<HoldResult> {
  const keys = nightKeys(roomId, checkIn, checkOut);
  if (!keys.length) return { acquired: false };

  const holdId = `${userId}:${Date.now()}`;
  const acquiredKeys: string[] = [];

  try {
    for (const key of keys) {
      const result = await redisClient.set(key, holdId, "EX", HOLD_TTL_SECONDS, "NX");
      if (result === null) {
        if (acquiredKeys.length) await redisClient.del(...acquiredKeys);
        return { acquired: false };
      }
      acquiredKeys.push(key);
    }
    return { acquired: true, holdId };
  } catch (err) {
    if (acquiredKeys.length) await redisClient.del(...acquiredKeys).catch(() => {});
    throw err;
  }
}

export async function releaseBookingHold(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<void> {
  const keys = nightKeys(roomId, checkIn, checkOut);
  if (keys.length) await redisClient.del(...keys);
}

