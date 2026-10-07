import "server-only";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export class OrderAccessError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "OrderAccessError";
  }
}

export async function authenticatedUid(request: Request): Promise<string> {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) throw new OrderAccessError("Please sign in to view this order.", 401);
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return decoded.uid;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Firebase Admin is not configured")) {
      throw new OrderAccessError("Order services are temporarily unavailable.", 503);
    }
    throw new OrderAccessError("Your session could not be verified. Please sign in again.", 401);
  }
}

export async function ownedOrder(orderId: string, uid: string) {
  if (!orderId || orderId.length > 160 || /[/.\[\]#?]/.test(orderId)) {
    throw new OrderAccessError("Order not found.", 404);
  }
  const ref = getAdminDb().collection("orders").doc(orderId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.get("userId") !== uid) throw new OrderAccessError("Order not found.", 404);
  return { ref, data: snapshot.data() as Record<string, unknown> };
}

export function safeErrorResponse(error: unknown) {
  if (error instanceof OrderAccessError) return { message: error.message, status: error.status };
  return { message: "Could not load this order. Please try again.", status: 500 };
}

export function isoDate(value: unknown): string | null {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }
  if (typeof value === "string" && Number.isFinite(Date.parse(value))) return new Date(value).toISOString();
  return null;
}

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
