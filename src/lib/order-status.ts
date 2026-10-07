export const ORDER_STATUS_FLOW = [
  "created",
  "verification_pending",
  "confirmed",
  "preparing",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
] as const;

export type OrderStatus = typeof ORDER_STATUS_FLOW[number] | "cancelled" | "rto";

export function normalizeOrderStatus(value: unknown): OrderStatus {
  const status = typeof value === "string" ? value.toLowerCase().trim().replaceAll(" ", "_") : "";
  if (status === "placed" || status === "created" || status === "verification_pending" || status === "pending" || status === "creation_failed" || status === "setup_required") return "verification_pending";
  if (status === "confirmed") return "confirmed";
  if (status === "processing" || status === "preparing") return "preparing";
  if (status === "shipped" || status === "awb_assigned" || status === "ready_to_ship") return "shipped";
  if (status === "in_transit" || status === "picked_up") return "in_transit";
  if (status === "out_for_delivery") return "out_for_delivery";
  if (status === "delivered") return "delivered";
  if (status === "cancelled" || status === "canceled") return "cancelled";
  if (status === "rto" || status === "returned_to_seller" || status === "return_to_origin") return "rto";
  return "verification_pending";
}

export function orderStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    created: "Order Created",
    verification_pending: "Awaiting Confirmation",
    confirmed: "Confirmed",
    preparing: "Preparing",
    shipped: "Shipped",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    rto: "Returned to Seller",
  };
  return labels[status];
}

export function orderStatusMessage(status: OrderStatus) {
  const messages: Record<OrderStatus, string> = {
    created: "Your order has been received successfully.",
    verification_pending: "We're verifying your order before dispatch.",
    confirmed: "Your order has been confirmed and is being prepared.",
    preparing: "Your order is being packed and prepared for dispatch.",
    shipped: "Great news! Your order has been shipped.",
    in_transit: "Your package is on its way.",
    out_for_delivery: "Your package is out for delivery today.",
    delivered: "Your order has been delivered. We hope you enjoy it!",
    cancelled: "This order has been cancelled.",
    rto: "This shipment is being returned to the seller.",
  };
  return messages[status];
}
