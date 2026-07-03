"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const AppTheme = ({ children }: { children: ReactNode }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default AppTheme;
