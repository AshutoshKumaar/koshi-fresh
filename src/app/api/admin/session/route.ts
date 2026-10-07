import { NextResponse } from "next/server";
import { AdminAccessError, requireAdmin } from "@/lib/admin-access";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(request);
    return NextResponse.json({ success: true, admin: { email: admin.email } });
  } catch (error) {
    const status = error instanceof AdminAccessError ? error.status : 500;
    return NextResponse.json({ success: false, message: error instanceof AdminAccessError ? error.message : "Could not verify admin access." }, { status });
  }
}
