import "server-only";
import { createHash } from "node:crypto";

const API_ROOT = "https://apiv2.shiprocket.in/v1/external";
export const SHIPROCKET_ORDER_CREATE_ENDPOINT = `${API_ROOT}/orders/create/adhoc`;
export const SHIPROCKET_ORDER_DETAILS_ENDPOINT = `${API_ROOT}/orders/show`;
const REQUEST_TIMEOUT_MS = 10_000;
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;
const RATE_CACHE_TTL_MS = 30_000;
const MAX_DIAGNOSTIC_TEXT_LENGTH = 240;

export interface ShiprocketPackageDimensions {
  length: number;
  breadth: number;
  height: number;
}

/** Outer parcel dimensions for the current single-package shipment, in centimeters. */
export function getShiprocketPackageDimensions(): ShiprocketPackageDimensions {
  const dimension = (name: "LENGTH" | "BREADTH" | "HEIGHT") => {
    const raw = process.env[`SHIPROCKET_PACKAGE_${name}_CM`]?.trim();
    const value = raw ? Number(raw) : Number.NaN;
    if (!Number.isFinite(value) || value <= 0) {
      throw new ShiprocketError(
        `Set SHIPROCKET_PACKAGE_${name}_CM to the measured package dimension in centimeters.`,
        "configuration",
      );
    }
    return value;
  };

  return {
    length: dimension("LENGTH"),
    breadth: dimension("BREADTH"),
    height: dimension("HEIGHT"),
  };
}

export interface SafeShiprocketResponse {
  message?: string | null;
  error?: unknown;
  errors?: unknown;
  code?: string | number | null;
  order_id?: string | null;
  shipment_id?: string | number | null;
  awb_code?: string | number | null;
  courier_company_id?: string | number | null;
  courier_name?: string | null;
  status?: unknown;
  status_code?: unknown;
  responseKeys?: string[];
}

export interface ShiprocketShipmentDetails {
  shipmentId: string | null;
  awb: string | null;
  courier: string | null;
  courierId: string | null;
  status: string | number | null;
  trackingUrl: string | null;
  diagnostic?: { httpStatus: number; durationMs: number; response: SafeShiprocketResponse };
}

export interface ShiprocketTrackingInfo extends ShiprocketShipmentDetails {
  estimatedDeliveryDate: string | null;
  lastUpdated: string | null;
  activities: Array<{ status: string; location: string | null; date: string | null }>;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function idString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return String(value);
  return null;
}

function safeText(value: unknown, max = 240): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

function trackingLink(value: unknown): string | null {
  const candidate = safeText(value, 1000);
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function asResponseRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function shiprocketOrderRow(body: unknown): Record<string, unknown> | null {
  const root = asResponseRecord(body);
  const data = asResponseRecord(root?.data);
  if (!Array.isArray(data?.data)) return null;
  return asResponseRecord(data.data[0]);
}

export class ShiprocketError extends Error {
  constructor(
    message: string,
    public readonly code: "configuration" | "authentication" | "timeout" | "api",
    public readonly httpStatus?: number,
    public readonly safeRemoteMessage?: string,
    public readonly endpoint?: string,
    public readonly durationMs?: number,
    public readonly safeResponse?: SafeShiprocketResponse,
  ) {
    super(message);
    this.name = "ShiprocketError";
  }
}

interface CourierOption {
  courierId: number;
  courierName: string;
  shippingCharge: number;
  estimatedDeliveryDays: number | null;
}

interface RateRequest {
  deliveryPincode: string;
  weightKg: number;
  paymentMethod: "cod" | "upi" | "card";
  declaredValue: number;
}

let tokenCache: { token: string; expiresAt: number; credentialKey: string } | null = null;
const rateCache = new Map<string, { expiresAt: number; options: CourierOption[] }>();

function credentials() {
  const rawEmail = process.env.SHIPROCKET_EMAIL;
  const rawPassword = process.env.SHIPROCKET_PASSWORD;
  const email = rawEmail?.trim();
  const password = rawPassword?.trim();
  if (!email || !password) throw new ShiprocketError("Shiprocket credentials are not configured.", "configuration");
  return { email, password };
}

function pickupPincode() {
  const pincode = process.env.SHIPROCKET_PICKUP_PINCODE?.trim();
  if (!pincode || !/^\d{6}$/.test(pincode)) throw new ShiprocketError("Set SHIPROCKET_PICKUP_PINCODE to the verified six-digit pickup postcode.", "configuration");
  return pincode;
}

function credentialKey(email: string, password: string) {
  return createHash("sha256").update(`${email}\0${password}`).digest("hex");
}

function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@");
  const [domainName = "", ...suffix] = domain.split(".");
  return `${local.slice(0, 1)}***@${domainName.slice(0, 1)}***${suffix.length ? `.${suffix.join(".")}` : ""}`;
}

function requestSensitiveValues(init: RequestInit) {
  if (typeof init.body !== "string") return [];
  try {
    const values: string[] = [];
    const visit = (value: unknown, key = "") => {
      if (typeof value === "string" && /(email|phone|mobile|address|customer_name|last_name|city|state|pincode|postcode|postal|pickup_location|password)/i.test(key)) values.push(value);
      else if (Array.isArray(value)) value.forEach((item) => visit(item, key));
      else if (value && typeof value === "object") {
        Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
      }
    };
    visit(JSON.parse(init.body));
    return values.filter((value) => value.length >= 3).sort((a, b) => b.length - a.length);
  } catch {
    return [];
  }
}

function safeEndpoint(url: string) {
  const parsed = new URL(url);
  return `${parsed.origin}${parsed.pathname}`;
}

function sanitizeDiagnosticText(value: string, sensitiveValues: string[]) {
  let safe = value;
  for (const sensitiveValue of sensitiveValues) safe = safe.split(sensitiveValue).join("[redacted]");
  return safe
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[token]")
    .replace(/\bBearer\s+[^\s,;]+/gi, "Bearer [redacted]")
    .replace(/(password|token|authorization|private[_ -]?key)\s*[:=]\s*[^,;\s]+/gi, "$1=[redacted]")
    .replace(/(?<!\d)\+?\d[\d\s().-]{8,}\d(?!\d)/g, "[number redacted]")
    .replace(/-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/g, "[key redacted]")
    .slice(0, MAX_DIAGNOSTIC_TEXT_LENGTH);
}

function sanitizeDiagnosticValue(value: unknown, sensitiveValues: string[], depth = 0): unknown {
  if (typeof value === "string") return sanitizeDiagnosticText(value, sensitiveValues);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (depth >= 3) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 10).map((item) => sanitizeDiagnosticValue(item, sensitiveValues, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).slice(0, 20).map(([key, nested]) => [
      key.slice(0, 80),
      /(email|phone|mobile|address|customer|last_name|city|state|pincode|postcode|postal|pickup_location|password|token|authorization|private[_ -]?key)/i.test(key)
        ? "[redacted]"
        : sanitizeDiagnosticValue(nested, sensitiveValues, depth + 1),
    ]));
  }
  return undefined;
}

function sanitizeDiagnosticIdentifier(value: unknown, sensitiveValues: string[]): string | number | null | undefined {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;
    return sensitiveValues.includes(String(value)) ? "[redacted]" : value;
  }
  if (typeof value !== "string") return undefined;
  let safe = value.trim();
  for (const sensitiveValue of sensitiveValues) safe = safe.split(sensitiveValue).join("[redacted]");
  return safe
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[token]")
    .replace(/\bBearer\s+[^\s,;]+/gi, "Bearer [redacted]")
    .replace(/(password|token|authorization|private[_ -]?key)\s*[:=]\s*[^,;\s]+/gi, "$1=[redacted]")
    .replace(/-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/g, "[key redacted]")
    .slice(0, MAX_DIAGNOSTIC_TEXT_LENGTH);
}

function safeRemoteResponse(body: unknown, sensitiveValues: string[]): SafeShiprocketResponse {
  const record = asResponseRecord(body);
  if (!record) return {};
  const orderRow = shiprocketOrderRow(record);
  const result: SafeShiprocketResponse = { responseKeys: Object.keys(record).slice(0, 40).map((key) => safeStructureKey(key, sensitiveValues)) };
  const findField = (names: string[]): unknown => {
    let found: unknown;
    let budget = 300;
    const visit = (value: unknown, depth: number) => {
      if (found !== undefined || budget-- <= 0 || depth > 6 || !value || typeof value !== "object") return;
      if (Array.isArray(value)) { for (const item of value.slice(0, 20)) visit(item, depth + 1); return; }
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        if (names.includes(key.toLowerCase()) && child !== undefined && child !== null) { found = child; return; }
      }
      for (const child of Object.values(value as Record<string, unknown>).slice(0, 40)) visit(child, depth + 1);
    };
    visit(record, 0);
    return found;
  };
  const message = findField(["message"]);
  if (typeof message === "string") result.message = sanitizeDiagnosticText(message, sensitiveValues);
  const remoteError = findField(["error"]);
  const remoteErrors = findField(["errors"]);
  if (remoteError !== undefined) result.error = sanitizeDiagnosticValue(remoteError, sensitiveValues);
  if (remoteErrors !== undefined) result.errors = sanitizeDiagnosticValue(remoteErrors, sensitiveValues);
  const remoteCode = findField(["code", "error_code"]);
  if (typeof remoteCode === "string" || typeof remoteCode === "number") result.code = sanitizeDiagnosticValue(remoteCode, sensitiveValues) as string | number;
  // Keep a generic `id` distinct from the documented Shiprocket order_id.
  const orderId = sanitizeDiagnosticIdentifier(findField(["order_id", "shiprocket_order_id"]), sensitiveValues);
  if (orderId !== undefined) result.order_id = String(orderId);
  const shipmentId = sanitizeDiagnosticIdentifier(orderRow?.shipment_id ?? findField(["shipment_id"]), sensitiveValues);
  if (shipmentId !== undefined) result.shipment_id = shipmentId;
  const awbCode = sanitizeDiagnosticIdentifier(orderRow?.awb_code ?? findField(["awb_code", "awb"]), sensitiveValues);
  if (awbCode !== undefined) result.awb_code = awbCode;
  const courierCompanyId = sanitizeDiagnosticIdentifier(orderRow?.courier_company_id ?? findField(["courier_company_id"]), sensitiveValues);
  if (courierCompanyId !== undefined) result.courier_company_id = courierCompanyId;
  const courierName = orderRow?.courier_name ?? findField(["courier_name"]);
  if (typeof courierName === "string") result.courier_name = sanitizeDiagnosticText(courierName, sensitiveValues);
  const status = orderRow?.status ?? findField(["status"]);
  const statusCode = orderRow?.status_code ?? findField(["status_code", "awb_assign_status"]);
  if (status !== undefined) result.status = sanitizeDiagnosticValue(status, sensitiveValues);
  if (statusCode !== undefined) result.status_code = sanitizeDiagnosticValue(statusCode, sensitiveValues);
  return result;
}

function responseValueType(value: unknown) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function safeStructureKey(key: string, sensitiveValues: string[]) {
  return sanitizeDiagnosticText(key, sensitiveValues).slice(0, 100);
}

function isSafeScalarField(key: string) {
  return /(id|order|shipment|awb|status|message|code)/i.test(key)
    && !/(customer|user|email|phone|mobile|address|name|token|auth|password|private|pincode|postcode|postal|zip)/i.test(key);
}

function safeStructureScalar(value: unknown, key: string, sensitiveValues: string[]) {
  if (!isSafeScalarField(key)) return undefined;
  if (typeof value === "string") {
    if (/id|order|shipment|awb/i.test(key)) return sanitizeDiagnosticIdentifier(value, sensitiveValues);
    return sanitizeDiagnosticText(value, sensitiveValues);
  }
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  return undefined;
}

function describeResponseStructure(value: unknown, sensitiveValues: string[]) {
  type Shape = {
    type: string;
    keys?: string[];
    fields?: Record<string, Shape>;
    length?: number;
    items?: Shape[];
    safeValue?: string | number | boolean | null;
    truncated?: boolean;
  };
  const budget = { remaining: 300 };
  const describe = (current: unknown, key: string, depth: number): Shape => {
    const type = responseValueType(current);
    const shape: Shape = { type };
    const safeValue = safeStructureScalar(current, key, sensitiveValues);
    if (safeValue !== undefined) shape.safeValue = safeValue;
    if (budget.remaining <= 0) return { ...shape, truncated: true };
    budget.remaining -= 1;

    if (Array.isArray(current)) {
      shape.length = current.length;
      if (depth >= 4) {
        if (current.length) shape.truncated = true;
        return shape;
      }
      shape.items = current.slice(0, 3).map((item) => describe(item, key, depth + 1));
      if (current.length > 3) shape.truncated = true;
      return shape;
    }

    if (current && typeof current === "object") {
      const entries = Object.entries(current as Record<string, unknown>);
      shape.keys = entries.slice(0, 40).map(([childKey]) => safeStructureKey(childKey, sensitiveValues));
      if (depth >= 4) {
        if (entries.length) shape.truncated = true;
        return shape;
      }
      shape.fields = Object.fromEntries(entries.slice(0, 40).map(([childKey, childValue]) => [
        safeStructureKey(childKey, sensitiveValues),
        describe(childValue, childKey, depth + 1),
      ]));
      if (entries.length > 40) shape.truncated = true;
    }
    return shape;
  };
  return describe(value, "", 0);
}

function findPossibleOrderIdentifiers(value: unknown, sensitiveValues: string[]) {
  const paths: string[] = [];
  let remaining = 500;
  const visit = (current: unknown, path: string[], depth: number) => {
    if (remaining <= 0 || depth > 8 || paths.length >= 20) return;
    remaining -= 1;
    if (Array.isArray(current)) {
      current.forEach((item, index) => visit(item, [...path, `[${index}]`], depth + 1));
      return;
    }
    if (!current || typeof current !== "object") return;
    for (const [key, child] of Object.entries(current as Record<string, unknown>)) {
      if (remaining <= 0 || paths.length >= 20) break;
      const currentPath = [...path, key];
      const keyLooksLikeOrderId = /(^|[_-])id($|[_-])|order.*id|id.*order|shipment.*id|awb.*(id|code|number)?/i.test(key);
      const usableScalar = (typeof child === "string" && child.trim().length > 0)
        || (typeof child === "number" && Number.isFinite(child) && child > 0);
      if (keyLooksLikeOrderId && usableScalar) paths.push(currentPath.map((part) => part.startsWith("[") ? part : safeStructureKey(part, sensitiveValues)).join("."));
      visit(child, currentPath, depth + 1);
    }
  };
  visit(value, [], 0);
  return paths;
}

function createResponseDataDiagnostic(value: unknown, sensitiveValues: string[]) {
  const root = asResponseRecord(value);
  const dataValue = root?.data;
  const dataRecord = asResponseRecord(dataValue);
  const nestedValue = dataRecord?.data;
  const identifierFields: Array<{ path: string; type: string; safeValue: string | number }> = [];
  const safeIdentifierKeys = new Set(["id", "order_id", "shiprocket_order_id", "channel_order_id", "shipment_id", "awb", "awb_code", "courier_company_id"]);
  const safeStatusKeys = new Set(["status", "status_code", "code", "message"]);
  const blockedPath = /(customer|user|billing|shipping|address|email|phone|mobile|name|pincode|postcode|postal|token|auth|password|private[_ -]?key)/i;
  let remaining = 180;

  const describe = (current: unknown, depth: number): Record<string, unknown> => {
    const shape: Record<string, unknown> = { type: responseValueType(current) };
    if (Array.isArray(current)) {
      shape.length = current.length;
      if (depth < 4) shape.items = current.slice(0, 3).map((item) => describe(item, depth + 1));
      if (current.length > 3 || (depth >= 4 && current.length > 0)) shape.truncated = true;
      return shape;
    }
    if (!current || typeof current !== "object") return shape;
    const entries = Object.entries(current as Record<string, unknown>);
    shape.keys = entries.slice(0, 40).map(([key]) => safeStructureKey(key, sensitiveValues));
    if (depth < 4 && remaining > 0) {
      shape.fields = Object.fromEntries(entries.slice(0, 40).map(([key, child]) => {
        remaining -= 1;
        return [safeStructureKey(key, sensitiveValues), describe(child, depth + 1)];
      }));
    } else if (entries.length) shape.truncated = true;
    if (entries.length > 40) shape.truncated = true;
    return shape;
  };

  const collectSafeFields = (current: unknown, path: string[], depth: number) => {
    if (identifierFields.length >= 60 || depth > 6 || !current || typeof current !== "object") return;
    if (Array.isArray(current)) {
      current.slice(0, 10).forEach((item, index) => collectSafeFields(item, [...path, `[${index}]`], depth + 1));
      return;
    }
    for (const [key, child] of Object.entries(current as Record<string, unknown>).slice(0, 40)) {
      const fieldPath = [...path, key];
      if (!fieldPath.some((part) => blockedPath.test(part))) {
        const normalizedKey = key.toLowerCase();
        const isIdentifier = safeIdentifierKeys.has(normalizedKey);
        const isSafeStatus = safeStatusKeys.has(normalizedKey);
        if ((isIdentifier || isSafeStatus) && (typeof child === "string" || typeof child === "number") && String(child).trim()) {
          const safeValue = isIdentifier
            ? sanitizeDiagnosticIdentifier(child, sensitiveValues)
            : sanitizeDiagnosticText(String(child), sensitiveValues);
          if (typeof safeValue === "string" || typeof safeValue === "number") {
            identifierFields.push({ path: fieldPath.join(".").replace(/\.\[/g, "["), type: typeof child, safeValue });
          }
        }
      }
      collectSafeFields(child, fieldPath, depth + 1);
    }
  };

  collectSafeFields(dataValue, ["data"], 0);
  return {
    dataType: responseValueType(dataValue),
    dataKeys: dataRecord ? Object.keys(dataRecord).slice(0, 40).map((key) => safeStructureKey(key, sensitiveValues)) : [],
    dataShape: describe(dataValue, 0),
    dataDataType: responseValueType(nestedValue),
    dataDataArrayLength: Array.isArray(nestedValue) ? nestedValue.length : null,
    dataDataShape: describe(nestedValue, 0),
    identifierAndStatusFields: identifierFields,
  };
}

function safeRemoteMessage(response: SafeShiprocketResponse) {
  if (typeof response.message === "string" && response.message) return response.message;
  if (typeof response.error === "string" && response.error) return response.error;
  if (typeof response.errors === "string" && response.errors) return response.errors;
  return "Shiprocket returned no safe error message.";
}

interface ShiprocketHttpResult<T> {
  body: T;
  httpStatus: number;
  durationMs: number;
}

async function requestWithMetadata<T>(url: string, init: RequestInit): Promise<ShiprocketHttpResult<T>> {
  const startedAt = Date.now();
  const endpoint = safeEndpoint(url);
  const sensitiveValues = requestSensitiveValues(init);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const safeResponse = safeRemoteResponse(body, sensitiveValues);
      throw new ShiprocketError(
        "Shiprocket could not complete the request.",
        response.status === 401 ? "authentication" : "api",
        response.status,
        safeRemoteMessage(safeResponse),
        endpoint,
        Date.now() - startedAt,
        safeResponse,
      );
    }
    return { body: body as T, httpStatus: response.status, durationMs: Date.now() - startedAt };
  } catch (error) {
    if (error instanceof ShiprocketError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ShiprocketError("Shiprocket request timed out. Please try again.", "timeout", undefined, "Shiprocket request timed out.", endpoint, Date.now() - startedAt);
    }
    throw new ShiprocketError("Shiprocket is temporarily unavailable. Please try again.", "api", undefined, "No HTTP response received from Shiprocket.", endpoint, Date.now() - startedAt);
  } finally {
    clearTimeout(timeout);
  }
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  return (await requestWithMetadata<T>(url, init)).body;
}

async function getToken() {
  const { email, password } = credentials();
  const key = credentialKey(email, password);
  if (tokenCache && tokenCache.expiresAt > Date.now() && tokenCache.credentialKey === key) return tokenCache.token;
  tokenCache = null;
  let result: { token?: unknown };
  try {
    result = await request(`${API_ROOT}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    const httpStatus = error instanceof ShiprocketError ? error.httpStatus : undefined;
    const remoteMessage = error instanceof ShiprocketError ? error.safeRemoteMessage : undefined;
    console.warn("[Shiprocket auth diagnostic]", {
      emailConfigured: Boolean(process.env.SHIPROCKET_EMAIL?.trim()),
      passwordConfigured: Boolean(process.env.SHIPROCKET_PASSWORD?.trim()),
      email: maskEmail(email),
      httpStatus: httpStatus ?? null,
      message: remoteMessage || (error instanceof ShiprocketError ? error.message : "Shiprocket login request failed."),
    });
    if (error instanceof ShiprocketError && error.code === "authentication") {
      throw new ShiprocketError("Shiprocket rejected login (HTTP 401). Check the API user email and password.", "authentication", error.httpStatus, remoteMessage, error.endpoint, error.durationMs, error.safeResponse);
    }
    if (error instanceof ShiprocketError && error.code === "api") {
      throw new ShiprocketError(
        error.httpStatus ? `Shiprocket login endpoint returned HTTP ${error.httpStatus}. ${remoteMessage || "Check Shiprocket API access and retry."}` : "Could not reach Shiprocket login. Check network access and retry.",
        "api",
        error.httpStatus,
        remoteMessage,
        error.endpoint,
        error.durationMs,
        error.safeResponse,
      );
    }
    throw error;
  }
  if (typeof result.token !== "string" || !result.token) throw new ShiprocketError("Shiprocket authentication response was invalid.", "authentication");
  tokenCache = { token: result.token, expiresAt: Date.now() + TOKEN_TTL_MS, credentialKey: key };
  return result.token;
}

async function authorizedRequest<T>(url: string, init: RequestInit): Promise<T> {
  const token = await getToken();
  try {
    return await request<T>(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
  } catch (error) {
    if (!(error instanceof ShiprocketError) || error.code !== "authentication") throw error;
    tokenCache = null;
    const refreshedToken = await getToken();
    return request<T>(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${refreshedToken}` } });
  }
}

async function authorizedRequestWithMetadata<T>(url: string, init: RequestInit): Promise<ShiprocketHttpResult<T>> {
  const token = await getToken();
  try {
    return await requestWithMetadata<T>(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
  } catch (error) {
    if (!(error instanceof ShiprocketError) || error.code !== "authentication") throw error;
    tokenCache = null;
    const refreshedToken = await getToken();
    return requestWithMetadata<T>(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${refreshedToken}` } });
  }
}

function numeric(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function isCodEnabled(value: unknown) {
  return value === true || value === 1 || value === "1";
}

export async function getCourierRates(input: RateRequest): Promise<CourierOption[]> {
  const pickupPostcode = pickupPincode();
  const cacheKey = [pickupPostcode, input.deliveryPincode, input.weightKg, input.paymentMethod, input.declaredValue].join(":");
  const cached = rateCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.options;

  const query = new URLSearchParams({
    pickup_postcode: pickupPostcode,
    delivery_postcode: input.deliveryPincode,
    weight: String(input.weightKg),
    cod: input.paymentMethod === "cod" ? "1" : "0",
    declared_value: String(Math.round(input.declaredValue)),
  });
  const response = await authorizedRequest<{ data?: { available_courier_companies?: unknown } }>(
    `${API_ROOT}/courier/serviceability/?${query.toString()}`,
    { method: "GET", headers: { Accept: "application/json" } },
  );
  const rows = response.data?.available_courier_companies;
  const options: CourierOption[] = Array.isArray(rows) ? rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const courier = row as Record<string, unknown>;
    const courierId = numeric(courier.courier_company_id);
    const shippingCharge = numeric(courier.rate);
    const courierName = typeof courier.courier_name === "string" ? courier.courier_name : "";
    const estimatedDeliveryDays = numeric(courier.estimated_delivery_days);
    if (!courierId || !courierName || shippingCharge === null || shippingCharge < 0) return [];
    if (input.paymentMethod === "cod" && !isCodEnabled(courier.cod)) return [];
    return [{ courierId, courierName, shippingCharge, estimatedDeliveryDays }];
  }) : [];

  if (rateCache.size > 200) {
    for (const [key, value] of rateCache) if (value.expiresAt <= Date.now()) rateCache.delete(key);
    if (rateCache.size > 200) rateCache.clear();
  }
  rateCache.set(cacheKey, { expiresAt: Date.now() + RATE_CACHE_TTL_MS, options });
  return options;
}

export function getPickupLocation() {
  return process.env.SHIPROCKET_PICKUP_LOCATION || null;
}

export async function createShiprocketOrder(payload: Record<string, unknown>): Promise<SafeShiprocketResponse & { order_id: string | number }> {
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  };
  const sensitiveValues = requestSensitiveValues(init);
  const orderItems = Array.isArray(payload.order_items) ? payload.order_items : [];
  const firstItem = asResponseRecord(orderItems[0]);
  console.info("[SHIPROCKET CREATE REQUEST SAFE SHAPE]", {
    endpoint: SHIPROCKET_ORDER_CREATE_ENDPOINT,
    payloadFieldNames: Object.keys(payload).slice(0, 60),
    merchantOrderReference: {
      path: "request.order_id",
      present: typeof payload.order_id === "string" && Boolean(payload.order_id.trim()),
      safeValue: sanitizeDiagnosticIdentifier(payload.order_id, sensitiveValues) ?? null,
    },
    channelIdPresent: Object.hasOwn(payload, "channel_id"),
    pickupLocationPresent: typeof payload.pickup_location === "string" && Boolean(payload.pickup_location.trim()),
    customerFieldNames: Object.keys(payload).filter((key) => /^(billing|shipping)_/.test(key)).slice(0, 40),
    productFieldNames: firstItem ? Object.keys(firstItem).slice(0, 30) : [],
    package: {
      length: typeof payload.length === "number" ? payload.length : null,
      breadth: typeof payload.breadth === "number" ? payload.breadth : null,
      height: typeof payload.height === "number" ? payload.height : null,
      weight: typeof payload.weight === "number" ? payload.weight : null,
    },
    paymentMethod: typeof payload.payment_method === "string" ? sanitizeDiagnosticText(payload.payment_method, sensitiveValues) : null,
  });
  const result = await authorizedRequestWithMetadata<unknown>(SHIPROCKET_ORDER_CREATE_ENDPOINT, init);
  const response = result.body;
  const topLevelKeys = response && typeof response === "object" && !Array.isArray(response)
    ? Object.keys(response as Record<string, unknown>).slice(0, 40).map((key) => safeStructureKey(key, sensitiveValues))
    : [];
  const possibleOrderIdentifierPaths = findPossibleOrderIdentifiers(response, sensitiveValues);
  console.info("[SHIPROCKET ORDER RESPONSE STRUCTURE]", {
    endpoint: SHIPROCKET_ORDER_CREATE_ENDPOINT,
    httpStatus: result.httpStatus,
    durationMs: result.durationMs,
    topLevelKeys,
    createResponseData: createResponseDataDiagnostic(response, sensitiveValues),
    responseShape: describeResponseStructure(response, sensitiveValues),
    possibleOrderIdentifierPresent: possibleOrderIdentifierPaths.length > 0,
    possibleOrderIdentifierPaths,
  });
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    throw new ShiprocketError(
      "Shiprocket returned an invalid order response.",
      "api",
      result.httpStatus,
      "Shiprocket returned an invalid order response.",
      SHIPROCKET_ORDER_CREATE_ENDPOINT,
      result.durationMs,
      safeRemoteResponse(response, sensitiveValues),
    );
  }
  const orderRow = shiprocketOrderRow(response);
  const safeResponse = safeRemoteResponse(response, sensitiveValues);
  const rawOrderId = orderRow?.id;
  const safeOrderId = sanitizeDiagnosticIdentifier(rawOrderId, sensitiveValues);
  const validOrderId = (typeof rawOrderId === "string" && rawOrderId.trim().length > 0
      && typeof safeOrderId === "string" && !/^\[(?:redacted|email|token|key redacted)\]$/.test(safeOrderId))
    || (typeof rawOrderId === "number" && Number.isFinite(rawOrderId) && rawOrderId > 0
      && typeof safeOrderId === "number" && safeOrderId > 0);
  if (!validOrderId) {
    throw new ShiprocketError(
      "Shiprocket returned a successful response without a usable order ID.",
      "api",
      result.httpStatus,
      "Shiprocket response is missing a usable data.data[0].id order identifier.",
      SHIPROCKET_ORDER_CREATE_ENDPOINT,
      result.durationMs,
      safeResponse,
    );
  }
  return {
    ...safeResponse,
    order_id: String(rawOrderId).trim(),
  };
}

/** Fetch only normalized shipment identifiers; the upstream order body contains customer data. */
export async function getShiprocketOrderDetails(orderId: string): Promise<ShiprocketShipmentDetails> {
  const endpoint = `${SHIPROCKET_ORDER_DETAILS_ENDPOINT}/${encodeURIComponent(orderId)}`;
  const result = await authorizedRequestWithMetadata<unknown>(endpoint, { method: "GET", headers: { Accept: "application/json" } });
  const body = result.body;
  const root = record(body);
  const data = record(root?.data);
  const shipmentsRaw = data?.shipments;
  const shipment = Array.isArray(shipmentsRaw) ? record(shipmentsRaw[0]) : record(shipmentsRaw);
  const awbData = record(data?.awb_data);
  const details: ShiprocketShipmentDetails = {
    shipmentId: idString(shipment?.id ?? shipment?.shipment_id ?? data?.shipment_id),
    awb: idString(shipment?.awb ?? shipment?.awb_code ?? awbData?.awb),
    courier: safeText(shipment?.courier_name ?? shipment?.courier),
    courierId: idString(shipment?.courier_company_id ?? shipment?.courier_id ?? data?.courier_company_id),
    status: typeof shipment?.status === "string" || typeof shipment?.status === "number"
      ? shipment.status
      : typeof data?.status === "string" || typeof data?.status === "number" ? data.status : null,
    trackingUrl: trackingLink(shipment?.tracking_url ?? awbData?.tracking_url),
    diagnostic: { httpStatus: result.httpStatus, durationMs: result.durationMs, response: safeRemoteResponse(body, []) },
  };
  return details;
}

export async function assignShiprocketAwb(shipmentId: string, courierId: number): Promise<ShiprocketShipmentDetails> {
  const shipmentIdNumber = Number(shipmentId);
  if (!idString(shipmentId) || !Number.isSafeInteger(shipmentIdNumber) || shipmentIdNumber <= 0 || !Number.isInteger(courierId) || courierId <= 0) {
    throw new ShiprocketError("Shiprocket shipment or courier selection is invalid.", "configuration");
  }
  const endpoint = `${API_ROOT}/courier/assign/awb`;
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ shipment_id: shipmentIdNumber, courier_id: courierId }),
  };
  const result = await authorizedRequestWithMetadata<unknown>(endpoint, init);
  const root = record(result.body);
  const data = record(root?.response);
  const responseData = record(data?.data);
  const awb = idString(responseData?.awb_code ?? data?.awb_code ?? root?.awb_code);
  const status = root?.awb_assign_status ?? data?.awb_assign_status ?? responseData?.awb_assign_status;
  if (!(status === 1 || status === "1" || status === true) || !awb) {
    const safe = safeRemoteResponse(result.body, requestSensitiveValues(init));
    throw new ShiprocketError(
      "Shiprocket did not confirm AWB assignment.",
      "api",
      result.httpStatus,
      safeRemoteMessage(safe),
      endpoint,
      result.durationMs,
      safe,
    );
  }
  return {
    shipmentId: idString(responseData?.shipment_id ?? data?.shipment_id) ?? shipmentId,
    awb,
    courier: safeText(responseData?.courier_name ?? data?.courier_name),
    courierId: idString(responseData?.courier_company_id ?? data?.courier_company_id),
    status: typeof responseData?.status === "string" || typeof responseData?.status === "number"
      ? responseData.status
      : typeof data?.status === "string" || typeof data?.status === "number" ? data.status : null,
    trackingUrl: trackingLink(responseData?.tracking_url ?? data?.tracking_url),
  };
}

export async function getShiprocketTracking(input: { awb?: string | null; shipmentId?: string | null }): Promise<ShiprocketTrackingInfo> {
  const awb = idString(input.awb);
  const shipmentId = idString(input.shipmentId);
  if (!awb && !shipmentId) throw new ShiprocketError("Tracking requires an AWB or shipment ID.", "configuration");
  const endpoint = awb
    ? `${API_ROOT}/courier/track/awb/${encodeURIComponent(awb)}`
    : `${API_ROOT}/courier/track/shipment/${encodeURIComponent(shipmentId!)}`;
  const body = await authorizedRequest<unknown>(endpoint, { method: "GET", headers: { Accept: "application/json" } });
  const root = record(body);
  const trackingData = record(root?.tracking_data) ?? record(record(root?.data)?.tracking_data) ?? record(root?.data);
  const trackRows = Array.isArray(trackingData?.shipment_track) ? trackingData.shipment_track : [];
  const current = record(trackRows[0]);
  const activitiesRaw = Array.isArray(trackingData?.shipment_track_activities) ? trackingData.shipment_track_activities : [];
  const activities = activitiesRaw.slice(0, 30).flatMap((item) => {
    const row = record(item);
    const status = safeText(row?.activity ?? row?.status);
    if (!status) return [];
    return [{ status, location: safeText(row?.location), date: safeText(row?.date ?? row?.activity_date) }];
  });
  const statusValue = current?.current_status ?? trackingData?.shipment_status ?? root?.shipment_status;
  const estimated = safeText(current?.edd ?? trackingData?.etd);
  return {
    shipmentId: idString(current?.shipment_id ?? trackingData?.shipment_id) ?? shipmentId,
    awb: idString(current?.awb_code ?? trackingData?.awb_code) ?? awb,
    courier: safeText(current?.courier_name ?? trackingData?.courier_name),
    courierId: idString(current?.courier_company_id ?? trackingData?.courier_company_id),
    status: typeof statusValue === "string" || typeof statusValue === "number" ? statusValue : null,
    trackingUrl: trackingLink(trackingData?.track_url ?? current?.track_url),
    estimatedDeliveryDate: estimated,
    lastUpdated: activities[0]?.date ?? safeText(current?.updated_at),
    activities,
  };
}
