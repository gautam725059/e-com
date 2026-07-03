"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "💫 Free Shipping above ₹599 | Use code WELCOME for 10% OFF",
  "🔥 COD Available | Pan India Delivery in 1-5 Days",
  "✨ New Arrivals Every Week | Shop Hair Accessories",
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ann">
      <span key={i} className="ann-msg">{MESSAGES[i]}</span>
    </div>
  );
}
