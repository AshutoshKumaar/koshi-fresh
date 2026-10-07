import { NextResponse } from "next/server";
import { getDiscount, getShipmentWeightKg, isPaymentMethod, validateCart } from "@/lib/checkout";
import { getCourierRates, ShiprocketError } from "@/lib/shiprocket";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (typeof input.pincode !== "string" || !/^\d{6}$/.test(input.pincode)) {
      return NextResponse.json({ success: false, message: "Enter a valid six-digit pincode." }, { status: 400 });
    }
    if (!isPaymentMethod(input.paymentMethod)) return NextResponse.json({ success: false, message: "Select a valid payment method." }, { status: 400 });
    const items = validateCart(input.cartItems);
    const weightKg = getShipmentWeightKg(items);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = getDiscount(input.couponCode, subtotal);
    if (typeof input.couponCode === "string" && input.couponCode.trim() && !discount.code) {
      return NextResponse.json({ success: false, message: "This coupon is not valid." }, { status: 400 });
    }
    const declaredValue = subtotal - discount.amount;
    const options = await getCourierRates({ deliveryPincode: input.pincode, weightKg, paymentMethod: input.paymentMethod, declaredValue });
    let message = "";
    if (!options.length && input.paymentMethod === "cod") {
      const prepaidOptions = await getCourierRates({ deliveryPincode: input.pincode, weightKg, paymentMethod: "upi", declaredValue });
      if (prepaidOptions.length) message = "COD is not available for this pincode. Please select a prepaid payment option.";
    }
    return NextResponse.json({ success: true, options, message }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && !(error instanceof ShiprocketError)) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    const shiprocketError = error as ShiprocketError;
    const status = shiprocketError.code === "configuration" ? 503 : shiprocketError.code === "timeout" ? 504 : 502;
    return NextResponse.json({ success: false, message: shiprocketError.message || "Delivery rates are temporarily unavailable." }, { status });
  }
}
