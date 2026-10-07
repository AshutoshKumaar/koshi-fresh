import { createHash, randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { authenticatedUid, isoDate, OrderAccessError } from "@/lib/order-access";
import { getDiscount, getShipmentWeightKg, isPaymentMethod, validateCart } from "@/lib/checkout";
import { getCourierRates, ShiprocketError } from "@/lib/shiprocket";
import { normalizeOrderStatus } from "@/lib/order-status";

export const runtime = "nodejs";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function idempotencyDocId(uid: string, key: string) {
  return createHash("sha256").update(`${uid}:${key}`).digest("hex");
}

function fulfillmentState(value: unknown) {
  if (!value || typeof value !== "object") return "pending";
  const status = (value as Record<string, unknown>).status;
  return typeof status === "string" ? status : "pending";
}

export async function POST(request: Request) {
  const requestStartedAt = Date.now();
  const debug = (stage: string, startedAt?: number) => {
    console.info("[ORDER DEBUG]", stage, { elapsedMs: Date.now() - requestStartedAt, ...(startedAt === undefined ? {} : { operationMs: Date.now() - startedAt }) });
  };
  debug("request received");
  try {
    const authorization = request.headers.get("authorization") || "";
    const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!idToken) return errorResponse("Please sign in to place your order.", 401);

    let decoded;
    const authStartedAt = Date.now();
    debug("auth verification started");
    try {
      decoded = await getAdminAuth().verifyIdToken(idToken);
      debug("auth verification completed", authStartedAt);
    } catch (error) {
      debug("auth verification failed", authStartedAt);
      if (error instanceof Error && error.message.startsWith("Firebase Admin is not configured")) {
        return errorResponse(error.message, 503);
      }
      return errorResponse("Your session could not be verified. Please sign in again.", 401);
    }

    const body = await request.json().catch(() => null);
    debug("request body parsed");
    if (!body || typeof body !== "object") return errorResponse("Invalid order request.");
    const input = body as Record<string, unknown>;
    const idempotencyKey = request.headers.get("idempotency-key")?.trim() || "";
    if (!/^[a-zA-Z0-9-]{16,80}$/.test(idempotencyKey)) return errorResponse("This checkout request is missing a valid idempotency key. Refresh checkout and try again.", 400);
    const requestRef = getAdminDb().collection("orderRequests").doc(idempotencyDocId(decoded.uid, idempotencyKey));
    const previousRequest = await requestRef.get();
    if (previousRequest.exists) {
      const previous = previousRequest.data() ?? {};
      const previousOrderId = typeof previous.orderId === "string" ? previous.orderId : "";
      if (!previousOrderId) return errorResponse("This order request is already being processed. Check My Orders before retrying.", 409);
      const previousOrder = await getAdminDb().collection("orders").doc(previousOrderId).get();
      const previousData = previousOrder.data() ?? {};
      const pricing = previousData.pricing && typeof previousData.pricing === "object" ? previousData.pricing as Record<string, unknown> : {};
      return NextResponse.json({ success: true, orderSaved: true, replayed: true, orderId: previousOrderId, createdAt: isoDate(previousData.createdAt), total: Number(pricing.total) || 0, paymentStatus: "pending", fulfillment: { status: fulfillmentState(previousData.fulfillment) } }, { status: 200 });
    }
    const customer = input.customer as Record<string, unknown> | null;
    const address = input.address as Record<string, unknown> | null;
    if (!customer || !address) return errorResponse("Enter your delivery details to continue.");
    const name = typeof customer.name === "string" ? customer.name.trim() : "";
    const phone = typeof customer.phone === "string" ? customer.phone.replace(/[\s()-]/g, "") : "";
    const addressLine1 = typeof address.addressLine1 === "string" ? address.addressLine1.trim() : "";
    const city = typeof address.city === "string" ? address.city.trim() : "";
    const state = typeof address.state === "string" ? address.state.trim() : "";
    const pincode = typeof address.pincode === "string" ? address.pincode.trim() : "";
    if (name.length < 2 || name.length > 100 || !/^\+?\d{10,13}$/.test(phone) || addressLine1.length < 5 || addressLine1.length > 200 || city.length < 2 || city.length > 80 || state.length < 2 || state.length > 80 || !/^\d{6}$/.test(pincode)) {
      return errorResponse("Check your name, phone, address, city, state, and six-digit pincode.");
    }
    if (!isPaymentMethod(input.paymentMethod)) return errorResponse("Select a valid payment method.");
    let items;
    try {
      items = validateCart(input.cartItems);
    } catch (error) {
      return errorResponse(error instanceof Error ? error.message : "Your cart is invalid.");
    }
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = getDiscount(input.couponCode, subtotal);
    if (typeof input.couponCode === "string" && input.couponCode.trim() && !discount.code) return errorResponse("This coupon is not valid.");
    if (!Number.isInteger(input.courierId) || (input.courierId as number) < 1) return errorResponse("Select an available delivery option.");

    let weightKg;
    try {
      weightKg = getShipmentWeightKg(items);
    } catch (error) {
      return errorResponse(error instanceof Error ? error.message : "Shipment weight is unavailable.", 503);
    }
    debug("request validation complete");
    let currentRates;
    const ratesStartedAt = Date.now();
    debug("rate lookup started");
    try {
      currentRates = await getCourierRates({ deliveryPincode: pincode, weightKg, paymentMethod: input.paymentMethod, declaredValue: subtotal - discount.amount });
      debug("rate lookup completed", ratesStartedAt);
    } catch (error) {
      debug("rate lookup failed", ratesStartedAt);
      if (error instanceof ShiprocketError) return errorResponse(error.message, error.code === "configuration" ? 503 : 502);
      throw error;
    }
    const selectedRate = currentRates.find((rate) => rate.courierId === input.courierId);
    if (!selectedRate) {
      if (input.paymentMethod === "cod" && currentRates.length === 0) {
        const prepaidRatesStartedAt = Date.now();
        debug("prepaid fallback rate lookup started");
        const prepaidRates = await getCourierRates({ deliveryPincode: pincode, weightKg, paymentMethod: "upi", declaredValue: subtotal - discount.amount });
        debug("prepaid fallback rate lookup completed", prepaidRatesStartedAt);
        if (prepaidRates.length) return errorResponse("COD is not available for this pincode. Select prepaid and check rates again.", 409);
      }
      return errorResponse("That delivery option is no longer available. Check rates again.", 409);
    }

    const total = Math.max(0, subtotal - discount.amount + selectedRate.shippingCharge);
    const orderId = `KF-${Date.now()}-${randomUUID().slice(0, 6)}`;
    const adminDb = getAdminDb();
    const orderRef = adminDb.collection("orders").doc(orderId);
    const finalRequestRef = adminDb.collection("orderRequests").doc(idempotencyDocId(decoded.uid, idempotencyKey));
    const eventTimestamp = new Date();
    const orderData = {
      orderId,
      userId: decoded.uid,
      customer: { name, email: decoded.email || "", phone },
      items: items.map(({ slug, variantId, name: itemName, weight, price, quantity, image }) => ({ slug, variantId, sku: variantId, name: itemName, weight, price, quantity, image })),
      address: { addressLine1, city, state, pincode, country: "India" },
      pricing: { subtotal, shipping: selectedRate.shippingCharge, discount: discount.amount, total },
      couponCode: discount.code || null,
      payment: { method: input.paymentMethod, status: "pending" },
      paymentPending: input.paymentMethod !== "cod",
      orderStatus: "verification_pending",
      fulfillment: { status: "verification_pending" },
      statusHistory: [
        { status: "created", timestamp: eventTimestamp, note: "Order received" },
        { status: "verification_pending", timestamp: eventTimestamp, note: "Awaiting order review" },
      ],
      shipping: {
        provider: null,
        courier: null,
        courierId: null,
        shippingCharge: selectedRate.shippingCharge,
        serviceabilityCheckedAt: FieldValue.serverTimestamp(),
        awb: null,
        trackingUrl: null,
        status: "pending",
      },
      shiprocket: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    const orderSetStartedAt = Date.now();
    debug("firestore order.set started");
    const claimedOrderId = await adminDb.runTransaction(async (transaction) => {
      const existingRequest = await transaction.get(finalRequestRef);
      if (existingRequest.exists) return String(existingRequest.get("orderId") || "");
      transaction.create(orderRef, orderData);
      transaction.create(finalRequestRef, { orderId, userId: decoded.uid, state: "order_created", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      return orderId;
    });
    if (claimedOrderId !== orderId) {
      if (!claimedOrderId) return errorResponse("This order request is already being processed. Check My Orders before retrying.", 409);
      const prior = await adminDb.collection("orders").doc(claimedOrderId).get();
      const priorData = prior.data() ?? {};
      const priorPricing = priorData.pricing && typeof priorData.pricing === "object" ? priorData.pricing as Record<string, unknown> : {};
      return NextResponse.json({ success: true, orderSaved: true, replayed: true, orderId: claimedOrderId, createdAt: isoDate(priorData.createdAt), total: Number(priorPricing.total) || 0, paymentStatus: "pending", fulfillment: { status: fulfillmentState(priorData.fulfillment) }, message: "This checkout request was already saved." }, { status: 200 });
    }
    debug("firestore order.set completed", orderSetStartedAt);

    const fulfillment = { status: "verification_pending", message: "Your order has been received and is awaiting confirmation." };
    debug("final response returned: 201; order awaiting confirmation");
    return NextResponse.json({ success: true, orderSaved: true, orderId, createdAt: eventTimestamp.toISOString(), total, shippingCharge: selectedRate.shippingCharge, paymentStatus: "pending", fulfillment, message: fulfillment.message }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place your order. Please try again.";
    const status = message.startsWith("Firebase Admin is not configured") ? 503 : 500;
    debug(`outer handler error; response status ${status}`);
    console.error("[ORDER DEBUG] outer handler error type", { name: error instanceof Error ? error.name : "UnknownError" });
    return errorResponse(status === 503 ? message : "Could not place your order. Please try again.", status);
  }
}

export async function GET(request: Request) {
  try {
    const uid = await authenticatedUid(request);
    const snapshot = await getAdminDb().collection("orders").where("userId", "==", uid).get();
    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();
      const shipping = data.shipping && typeof data.shipping === "object" ? data.shipping as Record<string, unknown> : {};
      const shiprocket = data.shiprocket && typeof data.shiprocket === "object" ? data.shiprocket as Record<string, unknown> : {};
      const payment = data.payment && typeof data.payment === "object" ? data.payment as Record<string, unknown> : {};
      const pricing = data.pricing && typeof data.pricing === "object" ? data.pricing as Record<string, unknown> : {};
      const items = Array.isArray(data.items) ? data.items.map((item) => {
        const row = item && typeof item === "object" ? item as Record<string, unknown> : {};
        return { name: typeof row.name === "string" ? row.name : "Product", quantity: Number(row.quantity) || 0, price: Number(row.price) || 0, image: typeof row.image === "string" ? row.image : null };
      }) : [];
      return {
        orderId: typeof data.orderId === "string" ? data.orderId : doc.id,
        createdAt: isoDate(data.createdAt), orderStatus: normalizeOrderStatus(data.orderStatus ?? shipping.status),
        statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory.flatMap((entry) => {
          if (!entry || typeof entry !== "object") return [];
          const event = entry as Record<string, unknown>;
          return [{ status: normalizeOrderStatus(event.status), timestamp: isoDate(event.timestamp), note: typeof event.note === "string" ? event.note : null }];
        }) : [],
        items, pricing: { subtotal: Number(pricing.subtotal) || 0, shipping: Number(pricing.shipping) || 0, discount: Number(pricing.discount) || 0, total: Number(pricing.total) || 0 },
        payment: { method: typeof payment.method === "string" ? payment.method : "", status: typeof payment.status === "string" ? payment.status : "pending" },
        shipping: {
          provider: typeof shipping.provider === "string" ? shipping.provider : null,
          courier: typeof shipping.courier === "string" ? shipping.courier : null,
          courierId: Number.isInteger(shipping.courierId) ? shipping.courierId : null,
          awb: typeof shipping.awb === "string" ? shipping.awb : null,
          trackingUrl: typeof shipping.trackingUrl === "string" ? shipping.trackingUrl : null,
          status: typeof shipping.status === "string" ? shipping.status : null,
          estimatedDeliveryDate: isoDate(shipping.estimatedDeliveryDate),
          shipmentId: typeof shipping.shipmentId === "string" || typeof shipping.shipmentId === "number" ? String(shipping.shipmentId) : typeof shiprocket.shipment_id === "string" || typeof shiprocket.shipment_id === "number" ? String(shiprocket.shipment_id) : null,
        },
      };
    }).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    const status = error instanceof OrderAccessError ? error.status : 500;
    return errorResponse(error instanceof OrderAccessError ? error.message : "Could not load your orders.", status);
  }
}
