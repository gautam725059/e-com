"use client";

import { useStore } from "@/context/StoreContext";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import SearchModal from "./SearchModal";

export default function Overlays() {
  const { state, dispatch } = useStore();
  const anyOpen = state.cartOpen || state.wishlistOpen || state.searchOpen;

  return (
    <>
      {anyOpen && (
        <div className="ov-backdrop" onClick={() => dispatch({ type: "CLOSE_ALL" })} />
      )}
      {state.cartOpen && <CartDrawer />}
      {state.wishlistOpen && <WishlistDrawer />}
      {state.searchOpen && <SearchModal />}
    </>
  );
}
