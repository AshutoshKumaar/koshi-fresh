import "server-only";
import { isoDate, record } from "@/lib/order-access";
import { normalizeOrderStatus } from "@/lib/order-status";

export function adminOrderView(orderId: string, data: Record<string, unknown>) {
  const customer = record(data.customer);
  const address = record(data.address);
  const pricing = record(data.pricing);
  const payment = record(data.payment);
  const shipping = record(data.shipping);
  const shiprocket = record(data.shiprocket);
  const items = Array.isArray(data.items) ? data.items.map((value) => {
    const item = record(value);
    return {
      name: typeof item.name === "string" ? item.name : "Product",
      sku: typeof item.sku === "string" ? item.sku : typeof item.variantId === "string" ? item.variantId : "",
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      weight: typeof item.weight === "string" ? item.weight : "",
    };
  }) : [];
  const statusHistory = Array.isArray(data.statusHistory) ? data.statusHistory.flatMap((value) => {
    const event = record(value);
    if (typeof event.status !== "string") return [];
    return [{ status: normalizeOrderStatus(event.status), timestamp: isoDate(event.timestamp), note: typeof event.note === "string" ? event.note : null }];
  }) : [];

  return {
    orderId,
    createdAt: isoDate(data.createdAt),
    updatedAt: isoDate(data.updatedAt),
    userId: typeof data.userId === "string" ? data.userId : "",
    orderStatus: normalizeOrderStatus(data.orderStatus ?? shipping.status),
    statusHistory,
    customer: {
      name: typeof customer.name === "string" ? customer.name : "",
      email: typeof customer.email === "string" ? customer.email : "",
      phone: typeof customer.phone === "string" ? customer.phone : "",
    },
    items,
    pricing: { subtotal: Number(pricing.subtotal) || 0, shipping: Number(pricing.shipping) || 0, discount: Number(pricing.discount) || 0, total: Number(pricing.total) || 0 },
    payment: { method: typeof payment.method === "string" ? payment.method : "", status: typeof payment.status === "string" ? payment.status : "pending" },
    address: {
      addressLine1: typeof address.addressLine1 === "string" ? address.addressLine1 : "",
      addressLine2: typeof address.addressLine2 === "string" ? address.addressLine2 : "",
      city: typeof address.city === "string" ? address.city : "",
      state: typeof address.state === "string" ? address.state : "",
      pincode: typeof address.pincode === "string" ? address.pincode : "",
      country: typeof address.country === "string" ? address.country : "India",
    },
    shipping: {
      provider: typeof shipping.provider === "string" ? shipping.provider : null,
      status: typeof shipping.status === "string" ? shipping.status : null,
      courier: typeof shipping.courier === "string" ? shipping.courier : null,
      trackingId: typeof shipping.awb === "string" ? shipping.awb : typeof shiprocket.awb_code === "string" ? shiprocket.awb_code : null,
      trackingUrl: typeof shipping.trackingUrl === "string" ? shipping.trackingUrl : null,
      shipmentId: typeof shipping.shipmentId === "string" || typeof shipping.shipmentId === "number"
        ? String(shipping.shipmentId)
        : typeof shiprocket.shipment_id === "string" || typeof shiprocket.shipment_id === "number" ? String(shiprocket.shipment_id) : null,
      estimatedDeliveryDate: isoDate(shipping.estimatedDeliveryDate),
    },
  };
}
