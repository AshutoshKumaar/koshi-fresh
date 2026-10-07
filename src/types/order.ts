import type { Timestamp, FieldValue } from "firebase/firestore";

export interface OrderItem {
  slug: string;
  variantId?: string;
  sku?: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderPayment {
  method: "upi" | "cod" | "card" | string;
  status: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
}

export interface OrderStatusEvent {
  status: string;
  timestamp: Timestamp | FieldValue | Date | null;
  note?: string | null;
}

export interface OrderShippingInfo {
  provider: string | null;
  courier: string | null;
  courierId?: number | null;
  shippingCharge?: number;
  estimatedDeliveryDays?: number | null;
  estimatedDeliveryDate?: string | null;
  serviceabilityCheckedAt?: Timestamp | FieldValue | Date | null;
  awb: string | null;
  trackingUrl: string | null;
  status: string | null;
  trackingStatus?: string | number | null;
  awbAssignment?: {
    state?: "in_progress" | "unknown" | "failed" | "completed";
    updatedAt?: Timestamp | FieldValue | Date | null;
    error?: { provider: "shiprocket"; message: string; httpStatus: number | null; timestamp: Timestamp | FieldValue | Date };
  };
}

export interface Order {
  orderId: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  address: OrderAddress;
  pricing: OrderPricing;
  payment: OrderPayment;
  orderStatus: "created" | "verification_pending" | "confirmed" | "preparing" | "shipped" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled" | "rto" | "placed" | "processing";
  fulfillment?: { status?: string; error?: Record<string, unknown> };
  statusHistory?: OrderStatusEvent[];
  shipping: OrderShippingInfo;
  shiprocket?: {
    order_id?: string | number;
    shipment_id?: string | number;
    awb_code?: string;
    courier_company_id?: string | number;
    courier_name?: string;
    status?: string | number;
  } | null;
  paymentPending?: boolean;
  createdAt: Timestamp | FieldValue | Date | null;
  updatedAt: Timestamp | FieldValue | Date | null;
}
