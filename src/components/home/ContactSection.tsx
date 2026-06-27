"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function ContactSection() {
  const [done, setDone] = useState(false);

  const submit = () => {
    setDone(true);
    setTimeout(() => setDone(false), 2200);
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <div className="sec-ey">Get in Touch</div>
        <div className="sec-ti" style={{ margin: "9px 0" }}>
          Contact Us
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "var(--grey)",
            marginBottom: "26px",
            lineHeight: 1.65,
            maxWidth: "480px",
          }}
        >
          Submit your product details and we&apos;ll get back to you within 24
          hours.
        </p>

        <div className="contact-grid">
          <input className="finput" type="text" placeholder="Full Name" />
          <input className="finput" type="email" placeholder="Email Address" />
          <input className="finput" type="tel" placeholder="Phone Number" />
          <select className="finput" defaultValue="">
            <option value="" disabled>
              Select Marketplace
            </option>
            <option>Amazon</option>
            <option>Blinkit</option>
            <option>Shopify</option>
            <option>Flipkart</option>
          </select>
          <input className="finput" type="text" placeholder="Product Name" />
          <input className="finput" type="text" placeholder="Product Description" />
        </div>

        <div className="upload-row">
          <label className="upload-label">
            <Upload size={19} />
            Upload Product Image
            <input type="file" style={{ display: "none" }} accept="image/*" />
          </label>
          <button
            className={`fsub${done ? " done" : ""}`}
            type="button"
            onClick={submit}
          >
            {done ? "Submitted!" : "Submit Product"}
          </button>
        </div>
      </div>
    </section>
  );
}
