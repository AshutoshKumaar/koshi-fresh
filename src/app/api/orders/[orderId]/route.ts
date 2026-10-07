import { NextResponse } from "next/server";
import { authenticatedUid, isoDate, OrderAccessError, ownedOrder, record } from "@/lib/order-access";
import { normalizeOrderStatus } from "@/lib/order-status";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const uid = await authenticatedUid(request);
    const { orderId } = await context.params;
    const { data } = await ownedOrder(orderId, uid);
    const shipping = record(data.shipping);
    const shiprocket = record(data.shiprocket);
    const payment = record(data.payment);
    const pricing = record(data.pricing);
    const address = record(data.address);
    const items = Array.isArray(data.items) ? data.items.map((item) => {
      const row = record(item);
      return { name: typeof row.name === "string" ? row.name : "Product", quantity: Number(row.quantity) || 0, price: Number(row.price) || 0, weight: typeof row.weight === "string" ? row.weight : "", image: typeof row.image === "string" ? row.image : null };
    }) : [];
    return NextResponse.json({ success: true, order: {
      orderId: typeof data.orderId === "string" ? data.orderId : orderId,
      createdAt: isoDate(data.createdAt), orderStatus: normalizeOrderStatus(data.orderStatus ?? shipping.status),
      statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory.flatMap((entry) => {
        const event = record(entry);
        if (!event.status) return [];
        return [{ status: normalizeOrderStatus(event.status), timestamp: isoDate(event.timestamp), note: typeof event.note === "string" ? event.note : null }];
      }) : [],
      items,
      pricing: { subtotal: Number(pricing.subtotal) || 0, shipping: Number(pricing.shipping) || 0, discount: Number(pricing.discount) || 0, total: Number(pricing.total) || 0 },
      payment: { method: typeof payment.method === "string" ? payment.method : "", status: typeof payment.status === "string" ? payment.status : "pending" },
      address: { addressLine1: typeof address.addressLine1 === "string" ? address.addressLine1 : "", addressLine2: typeof address.addressLine2 === "string" ? address.addressLine2 : "", city: typeof address.city === "string" ? address.city : "", state: typeof address.state === "string" ? address.state : "", pincode: typeof address.pincode === "string" ? address.pincode : "", country: typeof address.country === "string" ? address.country : "India" },
      shipping: {
        provider: typeof shipping.provider === "string" ? shipping.provider : null,
        courier: typeof shipping.courier === "string" ? shipping.courier : null,
        courierId: Number.isInteger(shipping.courierId) ? shipping.courierId : null,
        awb: typeof shipping.awb === "string" ? shipping.awb : null,
        trackingUrl: typeof shipping.trackingUrl === "string" ? shipping.trackingUrl : null,
        status: typeof shipping.status === "string" ? shipping.status : null,
        estimatedDeliveryDate: isoDate(shipping.estimatedDeliveryDate),
        shipmentId: typeof shipping.shipmentId === "string" || typeof shipping.shipmentId === "number" ? String(shipping.shipmentId) : typeof shiprocket.shipment_id === "string" || typeof shiprocket.shipment_id === "number" ? String(shiprocket.shipment_id) : null,
        shiprocketStatus: typeof shiprocket.status === "string" || typeof shiprocket.status === "number" ? String(shiprocket.status) : null,
      },
    } });
  } catch (error) {
    const status = error instanceof OrderAccessError ? error.status : 500;
    return NextResponse.json({ success: false, message: error instanceof OrderAccessError ? error.message : "Could not load this order." }, { status });
  }
}
