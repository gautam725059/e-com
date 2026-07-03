import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Overlays from "@/components/overlays/Overlays";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import AnnouncementBar from "@/components/home/AnnouncementBar";

// Shared chrome for every storefront page: announcement bar, navbar, content,
// footer, the cart/wishlist/search overlays and the floating WhatsApp button —
// all inside the `.sh` luxury-theme scope.
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sh">
      <AnnouncementBar />
      <Navbar />
      {children}
      <Footer />
      <Overlays />
      <WhatsAppButton />
    </div>
  );
}
