"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { env } from "@/env";
import useAuth from "@/hooks/auth";
import { usePathname, useRouter } from "@/i18n/routing";
import { appConfigAtom } from "@/stores";
import { createScopedLogger } from "@/utils";
import { isOutsideDeployMode } from "@/utils/302";
import { isAuthPath, needAuth } from "@/utils/path";

const logger = createScopedLogger("AppAuth");

const AppAuth = () => {
  const router = useRouter();
  const { onAuth } = useAuth();
  const setConfig = useSetAtom(appConfigAtom);

  const pathname = usePathname();

  useEffect(() => {
    if (isOutsideDeployMode()) {
      // Qianxi mode: use env API key as default, auth page lets user override
      setConfig((prev) => {
        if (!prev.apiKey) {
          return { ...prev, apiKey: env.NEXT_PUBLIC_302_API_KEY };
        }
        return prev;
      });
      // Don't redirect auth page — user can enter their own key there
      return;
    }

    logger.debug("needAuth:", needAuth(pathname));
    if (needAuth(pathname)) {
      onAuth();
    }
  }, [onAuth, router, setConfig, pathname]);
  return null;
};

export default AppAuth;