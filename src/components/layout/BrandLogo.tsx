"use client";

import { useState } from "react";

// Shows the Shanya logo image; on load error falls back to the serif wordmark
// with a gold underline (matches the reference markup).
export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={footer ? "ft-logo-fb" : "logo-fb"}>
        SHANYA<span />
      </div>
    );
  }

  return (
    <img
      src="/images/shanya1.png"
      alt="Shanya"
      onError={() => setErrored(true)}
    />
  );
}
