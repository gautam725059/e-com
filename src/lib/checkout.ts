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
