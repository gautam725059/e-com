"use client";

import React, { createContext, useContext, useEffect, useReducer, useMemo } from "react";
import type { Product, CartItem } from "@/types";

interface StoreState {
  cart: CartItem[];
  wishlist: number[];
  cartOpen: boolean;
  searchOpen: boolean;
  wishlistOpen: boolean;
  hydrated: boolean;
}

type Action =
  | { type: "ADD_TO_CART"; product: Product; qty: number; variant: string; color: string }
  | { type: "REMOVE_FROM_CART"; id: number }
  | { type: "UPDATE_QTY"; id: number; delta: number }
  | { type: "TOGGLE_WISHLIST"; id: number }
  | { type: "TOGGLE_CART" }
  | { type: "TOGGLE_SEARCH" }
  | { type: "TOGGLE_WISHLIST_MODAL" }
  | { type: "CLOSE_ALL" }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; cart: CartItem[]; wishlist: number[] };

const initialState: StoreState = {
  cart: [],
  wishlist: [],
  cartOpen: false,
  searchOpen: false,
  wishlistOpen: false,
  hydrated: false,
};

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.product.id === action.product.id
              ? { ...i, qty: i.qty + action.qty, variant: action.variant, color: action.color }
              : i
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { product: action.product, qty: action.qty, variant: action.variant, color: action.color },
        ],
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.product.id !== action.id) };
    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.product.id === action.id ? { ...i, qty: Math.max(1, i.qty + action.delta) } : i
        ),
      };
    case "TOGGLE_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((x) => x !== action.id)
          : [...state.wishlist, action.id],
      };
    case "TOGGLE_CART":
      return { ...state, cartOpen: !state.cartOpen, searchOpen: false, wishlistOpen: false };
    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen, cartOpen: false, wishlistOpen: false };
    case "TOGGLE_WISHLIST_MODAL":
      return { ...state, wishlistOpen: !state.wishlistOpen, cartOpen: false, searchOpen: false };
    case "CLOSE_ALL":
      return { ...state, cartOpen: false, searchOpen: false, wishlistOpen: false };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "HYDRATE":
      return { ...state, cart: action.cart, wishlist: action.wishlist, hydrated: true };
    default:
      return state;
  }
}

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);
const KEY = "shanya_store_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted cart/wishlist once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        dispatch({ type: "HYDRATE", cart: data.cart ?? [], wishlist: data.wishlist ?? [] });
      } else {
        dispatch({ type: "HYDRATE", cart: [], wishlist: [] });
      }
    } catch {
      dispatch({ type: "HYDRATE", cart: [], wishlist: [] });
    }
  }, []);

  // Persist after hydration so we never clobber stored data with the empty init.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
    } catch {}
  }, [state.cart, state.wishlist, state.hydrated]);

  // Lock body scroll while an overlay is open.
  useEffect(() => {
    const open = state.cartOpen || state.searchOpen || state.wishlistOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.cartOpen, state.searchOpen, state.wishlistOpen]);

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
    const cartTotal = state.cart.reduce((s, i) => s + i.qty * i.product.price, 0);
    return { state, dispatch, cartCount, cartTotal, wishlistCount: state.wishlist.length };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export default StoreContext;
