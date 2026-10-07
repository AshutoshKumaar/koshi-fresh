import "server-only";
import { getAdminAuth } from "@/lib/firebase-admin";

export class AdminAccessError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AdminAccessError";
  }
}

export async function requireAdmin(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) throw new AdminAccessError("Please sign in to continue.", 401);

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Firebase Admin is not configured")) {
      throw new AdminAccessError("Admin services are temporarily unavailable.", 503);
    }
    throw new AdminAccessError("Your session could not be verified. Please sign in again.", 401);
  }

  const configuredUids = (process.env.FIREBASE_ADMIN_UIDS ?? "").split(",").map((uid) => uid.trim()).filter(Boolean);
  if (decoded.admin !== true && !configuredUids.includes(decoded.uid)) {
    throw new AdminAccessError("You do not have permission to access order administration.", 403);
  }
  return { uid: decoded.uid, email: decoded.email ?? null };
}
