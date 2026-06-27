// sessionStorage key shared between the Address (/checkout) and
// Payment (/checkout/payment) steps.
export const CHECKOUT_KEY = "shanya_checkout_address";

export type CheckoutAddress = {
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

// Normalize a phone number to its last 10 digits so the value saved on an order
// and the value used to look up "My Orders" always match, regardless of
// formatting (+91, spaces, dashes, etc.).
export function normalizePhone(phone: string | null | undefined): string {
  return (phone || "").replace(/\D/g, "").slice(-10);
}
