import { NextResponse } from "next/server";
import { AdminAccessError, requireAdmin } from "@/lib/admin-access";
import { adminOrderView } from "@/lib/admin-order-data";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const params = new URL(request.url).searchParams;
    const query = (params.get("q") ?? "").trim().toLowerCase();
    const status = params.get("status") ?? "all";
    const snapshot = await getAdminDb().collection("orders").get();
    const orders = snapshot.docs.map((doc) => adminOrderView(doc.id, doc.data()))
      .filter((order) => {
        if (status === "pending_shipment" && order.shipping.trackingId) return false;
        if (status !== "all" && status !== "pending_shipment" && order.orderStatus !== status) return false;
        if (!query) return true;
        return [order.orderId, order.customer.name, order.customer.email, order.customer.phone]
          .some((value) => value.toLowerCase().includes(query));
      })
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    const status = error instanceof AdminAccessError ? error.status : 500;
    return NextResponse.json({ success: false, message: error instanceof AdminAccessError ? error.message : "Could not load admin orders." }, { status });
  }
}
