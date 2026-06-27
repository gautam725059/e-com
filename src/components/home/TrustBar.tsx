import { Truck, RotateCcw, Lock, Headphones } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free Shipping", sub: "Orders above ₹1000" },
  { icon: RotateCcw, title: "30-Day Returns", sub: "Hassle-free policy" },
  { icon: Lock, title: "Secure Payments", sub: "Encrypted & trusted" },
  { icon: Headphones, title: "24/7 Support", sub: "Help when you need it" },
];

export default function TrustBar() {
  return (
    <div className="trust">
      <div className="trust-g">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div className="ti" key={title}>
            <div className="ti-ic">
              <Icon size={18} />
            </div>
            <div>
              <div className="ti-t">{title}</div>
              <div className="ti-s">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
