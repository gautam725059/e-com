"use client";

import { useState } from "react";

// Plain <img> with an onError fallback (mirrors the reference's onerror swap).
export default function Img({
  src,
  fallback,
  alt,
  className,
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(src);
  const [prevSrc, setPrevSrc] = useState(src);
  // Follow the src prop when it changes (e.g. switching gallery images).
  if (src !== prevSrc) {
    setPrevSrc(src);
    setCurrent(src);
  }
  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
