import { FREE_SHIPPING_ABOVE } from "./data";

/**
 * SHIPPING — current rule (simple):
 *   • Order ≥ ₹999  → FREE
 *   • Order < ₹999  → flat ₹99
 *
 * LATER: when orders pick up, swap the body of `computeShipping()` for a live
 * courier costing API (Delhivery / Shiprocket / etc). The zone helpers below
 * are already written and ready for that — just plug the API rate in.
 */
export const FLAT_SHIPPING_FEE = 99;

export type Zone = { id: string; label: string; rate: number };

// Kept for the future courier-API integration (origin: Gurgaon).
export const ZONES: Record<string, Zone> = {
  local: { id: "local", label: "Delhi NCR", rate: 40 },
  north: { id: "north", label: "North India", rate: 60 },
  rest: { id: "rest", label: "Rest of India", rate: 80 },
  remote: { id: "remote", label: "North-East / J&K / Islands", rate: 120 },
};

/** Map an Indian 6-digit pincode to a shipping zone. Returns null if invalid. */
export function zoneForPincode(pincode: string): Zone | null {
  const pin = (pincode || "").replace(/\D/g, "");
  if (pin.length !== 6) return null;

  const d1 = pin[0];
  const p2 = pin.slice(0, 2);
  const p3 = pin.slice(0, 3);

  if (p3 === "110" || p2 === "12" || p3 === "201" || p3 === "203") return ZONES.local;
  if (p2 === "18" || p2 === "19" || p2 === "78" || p2 === "79" || p3 === "744") return ZONES.remote;
  if (d1 === "1" || d1 === "2" || d1 === "3") return ZONES.north;
  return ZONES.rest;
}

export type ShippingResult = {
  shipping: number;
  zone: Zone | null;
  free: boolean;
  known: boolean;
};

/**
 * Flat ₹99 below the free-shipping threshold. Pincode isn't needed yet, but the
 * argument stays so the courier-API version can drop in without changing callers.
 */
export function computeShipping(
  _pincode: string,
  subtotal: number,
  _opts?: { assumeRest?: boolean }
): ShippingResult {
  if (subtotal <= 0) return { shipping: 0, zone: null, free: false, known: true };
  if (subtotal >= FREE_SHIPPING_ABOVE) {
    return { shipping: 0, zone: null, free: true, known: true };
  }
  return { shipping: FLAT_SHIPPING_FEE, zone: null, free: false, known: true };
}
