import { NextResponse } from "next/server";
import { AdminAccessError, requireAdmin } from "@/lib/admin-access";
import { adminOrderView } from "@/lib/admin-order-data";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function validOrderId(value: string) {
  return Boolean(value) && value.length <= 160 && !/[/.\[\]#?]/.test(value);
}

export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await requireAdmin(request);
    const { orderId } = await context.params;
    if (!validOrderId(orderId)) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }
    const snapshot = await getAdminDb().collection("orders").doc(orderId).get();
    if (!snapshot.exists) return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    return NextResponse.json({ success: true, order: adminOrderView(snapshot.id, snapshot.data() ?? {}) });
  } catch (error) {
    const status = error instanceof AdminAccessError ? error.status : 500;
    return NextResponse.json({ success: false, message: error instanceof AdminAccessError ? error.message : "Could not load this order." }, { status });
  }
}
