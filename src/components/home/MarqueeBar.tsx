const ITEMS: { text: React.ReactNode }[] = [
  { text: <><b>Free Shipping</b> Above ₹1000</> },
  { text: <>Premium Hair Accessories</> },
  { text: <><b>30-Day</b> Easy Returns</> },
  { text: <>WhatsApp Support 24/7</> },
  { text: <><b>COD</b> Available</> },
  { text: <>100K+ Happy Customers</> },
  { text: <>Authentic &amp; Curated</> },
  { text: <><b>Secure</b> Payments</> },
];

export default function MarqueeBar() {
  // Duplicated for a seamless -50% loop.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="mq" aria-hidden="true">
      <div className="mq-track">
        {loop.map((item, i) => (
          <span className="mq-item" key={i}>
            {item.text}
            <span className="mq-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
