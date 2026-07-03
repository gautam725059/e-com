import { Gem, HeartHandshake, Sparkles, Truck } from "lucide-react";

const PILLARS = [
  { icon: Gem, title: "Premium Quality", text: "Every piece is quality-checked and built to last — no cheap finishes." },
  { icon: HeartHandshake, title: "Gentle on Hair", text: "Snag-free, breakage-free designs that care for your hair, every day." },
  { icon: Sparkles, title: "Affordable Luxury", text: "Trend-led, elegant styles starting at just ₹49 — luxury for everyone." },
  { icon: Truck, title: "Fast Pan-India", text: "Delivered to your door in 1–5 days, with COD available everywhere." },
];

export default function WhyShanya() {
  return (
    <section className="sec why">
      <div className="page-width">
        <div className="why-grid">
          <div className="why-intro">
            <div className="sec-ey">Our Story</div>
            <h2 className="sec-ti">Why Shanya?</h2>
            <p>
              Shanya was born from a simple belief — that every woman deserves
              accessories that feel <em>premium</em> without the premium price.
            </p>
            <p>
              From everyday claw clips to festive pearl headbands, each Shanya
              piece is thoughtfully designed in India, gentle on your hair, and
              made to make you feel effortlessly put-together. Loved by{" "}
              <strong>10,000+ happy customers</strong> across the country.
            </p>
          </div>

          <div className="why-pillars">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div className="why-card" key={title}>
                <span className="why-ic"><Icon size={20} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
