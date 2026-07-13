import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "We deliver Pan India in 1–5 business days. You'll get a tracking link as soon as your order ships.",
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "Yes — COD is available across India on orders of ₹1499 and above. For orders below ₹1499, you can pay online via UPI, cards, net banking or wallets at checkout.",
  },
  {
    q: "What is your return / exchange policy?",
    a: "We offer easy 7-day returns on unused products in original packaging. Reach us on WhatsApp to start a return.",
  },
  {
    q: "Do you charge for shipping?",
    a: "Shipping is FREE on all orders above ₹999. For orders below ₹999, a flat shipping charge of ₹99 applies.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Order page with your order number and phone, or click the tracking link we send you on WhatsApp.",
  },
  {
    q: "Are the products good quality?",
    a: "Absolutely — every Shanya accessory is quality-checked, gentle on hair, and loved by 10,000+ happy customers.",
  },
];

export default function FaqSection() {
  return (
    <section className="sec" id="faq" style={{ background: "var(--offwhite)" }}>
      <div className="page-width" style={{ maxWidth: 820, margin: "0 auto" }}>
        <div className="center" style={{ marginBottom: 32 }}>
          <div className="sec-ey">Help Centre</div>
          <h2 className="sec-ti">Frequently Asked Questions</h2>
        </div>

        <div className="faq">
          {FAQS.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <Plus size={18} className="faq-icon" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
