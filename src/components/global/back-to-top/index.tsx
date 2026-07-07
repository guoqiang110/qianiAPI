"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.30)] transition hover:bg-sky-700 hover:shadow-[0_12px_32px_rgba(37,99,235,0.40)] hover:-translate-y-0.5"
      aria-label="回到顶部"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
