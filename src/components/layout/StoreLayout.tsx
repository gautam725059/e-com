import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Overlays from "@/components/overlays/Overlays";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Shared chrome for every storefront page: announcement bar, navbar, content,
// footer, the cart/wishlist/search overlays and the floating WhatsApp button —
// all inside the `.sh` luxury-theme scope.
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sh">
      <div className="ann">
        <b>FREE SHIPPING</b> on orders above ₹1000 &nbsp;·&nbsp; Easy{" "}
        <b>30-Day Returns</b> &nbsp;·&nbsp; COD Available
      </div>
      <Navbar />
      {children}
      <Footer />
      <Overlays />
      <WhatsAppButton />
    </div>
  );
}
