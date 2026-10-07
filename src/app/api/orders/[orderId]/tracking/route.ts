import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { authenticatedUid, OrderAccessError, ownedOrder, record } from "@/lib/order-access";
import { getShiprocketTracking, ShiprocketError } from "@/lib/shiprocket";

export const runtime = "nodejs";

function appShippingStatus(status: string | number): string | null {
  if (typeof status !== "string") return null;
  const value = status.toLowerCase().replace(/[_-]+/g, " ");
  if (value.includes("rto") || value.includes("return to origin")) return "rto";
  if (value.includes("cancel")) return "cancelled";
  if (value.includes("fail")) return "failed";
  if (value.includes("out for delivery")) return "out_for_delivery";
  if (/\bdelivered\b/.test(value)) return "delivered";
  if (value.includes("transit")) return "in_transit";
  if (value.includes("pick")) return "picked_up";
  if (value.includes("ready to ship")) return "ready_to_ship";
  return null;
}

export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const uid = await authenticatedUid(request);
    const { orderId } = await context.params;
    const { ref, data } = await ownedOrder(orderId, uid);
    const shipping = record(data.shipping);
    const awb = typeof shipping.awb === "string" ? shipping.awb.trim() : "";
    if (!awb) {
      return NextResponse.json({ success: true, tracking: null, message: "Tracking is not available yet." });
    }
    const tracking = await getShiprocketTracking({ awb, shipmentId: null });
    const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    if (tracking.shipmentId) patch["shiprocket.shipment_id"] = tracking.shipmentId;
    if (tracking.awb) {
      patch["shipping.awb"] = tracking.awb;
      patch["shiprocket.awb_code"] = tracking.awb;
    }
    if (tracking.courier) patch["shipping.courier"] = tracking.courier;
    if (tracking.trackingUrl) patch["shipping.trackingUrl"] = tracking.trackingUrl;
    if (tracking.estimatedDeliveryDate) patch["shipping.estimatedDeliveryDate"] = tracking.estimatedDeliveryDate;
    if (tracking.status !== null) patch["shipping.trackingStatus"] = tracking.status;
    const normalizedStatus = tracking.status === null ? null : appShippingStatus(tracking.status);
    if (normalizedStatus) {
      patch["shipping.status"] = normalizedStatus;
      patch.orderStatus = normalizedStatus;
      patch["fulfillment.status"] = normalizedStatus;
      patch.statusHistory = FieldValue.arrayUnion({ status: normalizedStatus, timestamp: Timestamp.now(), note: "Tracking status updated" });
    }
    await ref.update(patch);
    return NextResponse.json({ success: true, tracking });
  } catch (error) {
    const status = error instanceof OrderAccessError ? error.status : 502;
    const message = error instanceof OrderAccessError
      ? error.message
      : error instanceof ShiprocketError
        ? "Shipment tracking is temporarily unavailable. Please try again later."
        : "Could not load shipment tracking.";
    return NextResponse.json({ success: false, message }, { status });
  }
}
