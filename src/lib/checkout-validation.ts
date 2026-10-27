export type CheckoutField = "name" | "phone" | "streetAddress" | "locality" | "landmark" | "city" | "state" | "pincode" | "businessName" | "gstin";

export type CheckoutValues = Record<CheckoutField, string>;

export function normalizeIndianMobileDigits(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function validateCheckoutField(field: CheckoutField, rawValue: string, businessOrder = false): string {
  const value = rawValue.trim();

  switch (field) {
    case "name":
      if (!value) return "Enter your full name.";
      if (value.length < 2 || value.length > 100 || !/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(value)) return "Use 2–100 letters, spaces, apostrophes, dots, or hyphens.";
      return "";
    case "phone": {
      const normalized = value.replace(/[\s()-]/g, "");
      if (!normalized) return "Enter your mobile number.";
      if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(normalized)) return "Enter a valid 10-digit Indian mobile number after +91.";
      return "";
    }
    case "streetAddress":
      if (!value) return "Enter your house or flat number and building.";
      if (value.length < 3 || value.length > 120 || !/^[\p{L}\p{M}\p{N}\s,.'/#&()-]+$/u.test(value)) return "Use 3–120 characters. Avoid symbols such as < or >.";
      return "";
    case "locality":
      if (!value) return "Enter your area, street, or locality.";
      if (value.length < 2 || value.length > 120 || !/^[\p{L}\p{M}\p{N}\s,.'/#&()-]+$/u.test(value)) return "Use 2–120 letters, numbers, and common address characters.";
      return "";
    case "landmark":
      if (!value) return "";
      if (value.length > 100 || !/^[\p{L}\p{M}\p{N}\s,.'/#&()-]+$/u.test(value)) return "Use up to 100 letters, numbers, and common address characters.";
      return "";
    case "city":
    case "state":
      if (!value) return field === "city" ? "Enter your city." : "Enter your state.";
      if (value.length < 2 || value.length > 80 || !/^[\p{L}\p{M}\s.'-]+$/u.test(value)) return "Use 2–80 letters, spaces, dots, or hyphens.";
      return "";
    case "pincode":
      if (!/^[1-9]\d{5}$/.test(value)) return "Enter a valid 6-digit Indian pincode.";
      return "";
    case "businessName":
      if (!businessOrder) return "";
      if (!value) return "Enter the business name for the invoice.";
      if (value.length < 2 || value.length > 120 || /[<>\u0000-\u001f]/.test(value)) return "Enter a valid business name (2–120 characters).";
      return "";
    case "gstin":
      if (!value) return "";
      if (!/^(0[1-9]|[1-2][0-9]|3[0-8]|97)[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value.toUpperCase())) return "Enter a valid 15-character GSTIN.";
      return "";
  }
}

export function validateCheckoutValues(values: CheckoutValues, businessOrder: boolean) {
  return (Object.keys(values) as CheckoutField[]).reduce<Partial<Record<CheckoutField, string>>>((errors, field) => {
    const error = validateCheckoutField(field, values[field], businessOrder);
    if (error) errors[field] = error;
    return errors;
  }, {});
}
