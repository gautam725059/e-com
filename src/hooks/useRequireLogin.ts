"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side login gate. If the user is not logged in, redirects to
 * /login?redirect=<next> so they return to this page after authenticating.
 *
 * Returns { checked, allowed } so the page can render a loading state until
 * the localStorage check has run (avoids SSR/hydration flash).
 */
export function useRequireLogin(next: string) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("userLoggedIn") === "true";
    if (!loggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(next)}`);
    } else {
      setAllowed(true);
    }
    setChecked(true);
  }, [next, router]);

  return { checked, allowed };
}
