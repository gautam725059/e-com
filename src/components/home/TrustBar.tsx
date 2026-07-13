import { Truck, Banknote, RotateCcw, Users } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free Shipping", sub: "On orders above ₹999" },
  { icon: Banknote, title: "COD Available", sub: "On orders ₹1499+" },
  { icon: RotateCcw, title: "Easy Returns", sub: "Hassle-free policy" },
  { icon: Users, title: "10,000+ Customers", sub: "Loved across India" },
];

function TrustItem({
  Icon,
  title,
  sub,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  sub: string;
}) {
  return (
    <div className="ti">
      <div className="ti-ic">
        <Icon size={18} />
      </div>
      <div>
        <div className="ti-t">{title}</div>
        <div className="ti-s">{sub}</div>
      </div>
    </div>
  );
}

export default function TrustBar() {
  return (
    <div className="trust">
      {/* Desktop / tablet: static grid */}
      <div className="trust-g">
        {ITEMS.map((it) => (
          <TrustItem key={it.title} Icon={it.icon} title={it.title} sub={it.sub} />
        ))}
      </div>

      {/* Mobile: scrolling marquee (duplicated for a seamless loop) */}
      <div className="trust-mq" aria-hidden="true">
        <div className="trust-mq-track">
          {[...ITEMS, ...ITEMS].map((it, i) => (
            <TrustItem key={i} Icon={it.icon} title={it.title} sub={it.sub} />
          ))}
        </div>
      </div>
    </div>
  );
}
