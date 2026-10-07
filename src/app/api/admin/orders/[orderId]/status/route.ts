import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { AdminAccessError, requireAdmin } from "@/lib/admin-access";
import { getAdminDb } from "@/lib/firebase-admin";
import { normalizeOrderStatus, type OrderStatus } from "@/lib/order-status";

export const runtime = "nodejs";

const transitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  verification_pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["cancelled"],
  shipped: ["in_transit", "rto"],
  in_transit: ["out_for_delivery", "rto"],
  out_for_delivery: ["delivered", "rto"],
};

function validOrderId(value: string) {
  return Boolean(value) && value.length <= 160 && !/[/.\[\]#?]/.test(value);
}

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await requireAdmin(request);
    const { orderId } = await context.params;
    if (!validOrderId(orderId)) return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    const body = await request.json().catch(() => null) as { status?: unknown } | null;
    if (typeof body?.status !== "string") return NextResponse.json({ success: false, message: "Choose a valid next order status." }, { status: 400 });
    const targetStatus = normalizeOrderStatus(body.status);
    if (!["confirmed", "preparing", "in_transit", "out_for_delivery", "delivered", "cancelled", "rto"].includes(targetStatus)) {
      return NextResponse.json({ success: false, message: "That status cannot be set directly." }, { status: 400 });
    }
    const ref = getAdminDb().collection("orders").doc(orderId);
    let nextStatus: OrderStatus | null = null;
    await getAdminDb().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) return;
      const data = snapshot.data() ?? {};
      const shipping = data.shipping && typeof data.shipping === "object" ? data.shipping as Record<string, unknown> : {};
      const current = normalizeOrderStatus(data.orderStatus ?? shipping.status);
      if (!transitions[current]?.includes(targetStatus)) return;
      nextStatus = targetStatus;
      transaction.update(ref, {
        orderStatus: targetStatus,
        "fulfillment.status": targetStatus,
        "shipping.status": targetStatus,
        statusHistory: FieldValue.arrayUnion({ status: targetStatus, timestamp: Timestamp.now(), note: targetStatus === "confirmed" ? "Order confirmed" : targetStatus === "preparing" ? "Preparation started" : `Order ${targetStatus.replaceAll("_", " ")}` }),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    if (nextStatus === null) {
      const exists = await ref.get();
      if (!exists.exists) return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
      return NextResponse.json({ success: false, message: "That order status transition is not allowed." }, { status: 409 });
    }
    return NextResponse.json({ success: true, status: nextStatus });
  } catch (error) {
    const status = error instanceof AdminAccessError ? error.status : 500;
    return NextResponse.json({ success: false, message: error instanceof AdminAccessError ? error.message : "Could not update order status." }, { status });
  }
}
