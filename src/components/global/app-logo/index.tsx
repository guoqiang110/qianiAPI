"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <Link href="/zh" className={cn("flex items-center gap-2.5 no-underline", className)}>
      <Image
        alt="乾羲API"
        priority
        src="/logo.png"
        width={36}
        height={36}
        className="rounded-lg"
      />
      <span className="font-bold text-lg tracking-tight text-foreground">乾羲API</span>
    </Link>
  );
}
