import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { AdminAccessError, requireAdmin } from "@/lib/admin-access";
import { getAdminDb } from "@/lib/firebase-admin";
import { normalizeOrderStatus } from "@/lib/order-status";

export const runtime = "nodejs";

function safeTrackingUrl(value: unknown): string | null | undefined {
  if (value === undefined || value === null || (typeof value === "string" && !value.trim())) return null;
  if (typeof value !== "string" || value.trim().length > 1000) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function validOrderId(value: string) {
  return Boolean(value) && value.length <= 160 && !/[/.\[\]#?]/.test(value);
}

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await requireAdmin(request);
    const { orderId } = await context.params;
    if (!validOrderId(orderId)) return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const courier = typeof body?.courier === "string" ? body.courier.trim() : "";
    const trackingId = typeof body?.trackingId === "string" ? body.trackingId.trim() : "";
    const shipmentId = typeof body?.shipmentId === "string" ? body.shipmentId.trim() : "";
    const trackingUrl = safeTrackingUrl(body?.trackingUrl);
    const estimatedRaw = typeof body?.estimatedDeliveryDate === "string" ? body.estimatedDeliveryDate.trim() : "";
    const estimatedDate = estimatedRaw ? new Date(`${estimatedRaw}T00:00:00.000Z`) : null;
    if (courier.length < 2 || courier.length > 80 || !/^[A-Za-z0-9-]{4,100}$/.test(trackingId)) {
      return NextResponse.json({ success: false, message: "Enter a courier name and a valid tracking ID before marking the order shipped." }, { status: 400 });
    }
    if (trackingUrl === undefined || (shipmentId && shipmentId.length > 120) || (estimatedRaw && (!/^\d{4}-\d{2}-\d{2}$/.test(estimatedRaw) || !estimatedDate || Number.isNaN(estimatedDate.getTime()) || estimatedDate.toISOString().slice(0, 10) !== estimatedRaw))) {
      return NextResponse.json({ success: false, message: "Check the optional shipment ID, secure tracking URL, and estimated delivery date." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.collection("orders").doc(orderId);
    let saved = false;
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) return;
      const data = snapshot.data() ?? {};
      const shipping = data.shipping && typeof data.shipping === "object" ? data.shipping as Record<string, unknown> : {};
      const current = normalizeOrderStatus(data.orderStatus ?? shipping.status);
      if (current !== "preparing" && current !== "shipped") return;
      saved = true;
      const update: Record<string, unknown> = {
        orderStatus: "shipped",
        "fulfillment.status": "shipped",
        "shipping.provider": "shiprocket",
        "shipping.status": "shipped",
        "shipping.courier": courier,
        "shipping.awb": trackingId,
        "shipping.trackingUrl": trackingUrl,
        "shipping.estimatedDeliveryDate": estimatedDate?.toISOString() ?? null,
        "shipping.manualUpdatedAt": FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      if (shipmentId) {
        update["shipping.shipmentId"] = shipmentId;
        update["shiprocket.shipment_id"] = shipmentId;
      }
      if (current === "preparing") {
        update.statusHistory = FieldValue.arrayUnion({ status: "shipped", timestamp: Timestamp.now(), note: "Shipment dispatched" });
      }
      transaction.update(ref, update);
    });
    if (!saved) {
      const snapshot = await ref.get();
      if (!snapshot.exists) return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
      return NextResponse.json({ success: false, message: "Confirm and prepare this order before saving shipment details." }, { status: 409 });
    }
    return NextResponse.json({ success: true, message: "Shipment details saved successfully." });
  } catch (error) {
    const status = error instanceof AdminAccessError ? error.status : 500;
    return NextResponse.json({ success: false, message: error instanceof AdminAccessError ? error.message : "Could not save shipment details." }, { status });
  }
}
