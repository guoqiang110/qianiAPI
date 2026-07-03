"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  type SignInFormType,
  SignInSchema,
} from "@/components/forms/auth/schema";
import { useRouter } from "@/i18n/routing";
import { login } from "@/services/auth";
import { appConfigAtom } from "@/stores/slices/config_store";
import { isAuthPath } from "@/utils/path";

const API_KEY_STORE_KEY = "qianxi_api_key";

const useAuth = () => {
  const [isPending, setIsPending] = useState(false);
  const { replace } = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const setConfig = useSetAtom(appConfigAtom);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignInFormType>({
    defaultValues: {
      apiKey: "",
      remember: true,
    },
    resolver: zodResolver(SignInSchema),
  });

  // Restore saved key on mount
  useState(() => {
    const saved = localStorage.getItem(API_KEY_STORE_KEY);
    if (saved) {
      setValue("apiKey", saved);
      setConfig((prev) => ({ ...prev, apiKey: saved }));
    }
  });

  const performAuth = useCallback(
    async ({ apiKey, remember }: SignInFormType) => {
      try {
        setIsPending(true);

        const result = await login(apiKey);

        if (result.success) {
          setConfig((prev) => ({ ...prev, apiKey }));

          if (remember) {
            localStorage.setItem(API_KEY_STORE_KEY, apiKey);
          } else {
            sessionStorage.setItem(API_KEY_STORE_KEY, apiKey);
          }

          if (isAuthPath(pathname)) {
            replace("/");
          }
        } else {
          setError("apiKey", {
            type: "server",
            message: result.error || "验证失败",
          });
        }
      } catch {
        setError("apiKey", {
          type: "server",
          message: "验证失败，请重试",
        });
      } finally {
        setIsPending(false);
      }
    },
    [setError, pathname, replace, setConfig]
  );

  const onSubmit = useCallback(
    async (data: SignInFormType) => {
      await performAuth(data);
    },
    [performAuth]
  );

  const onAuth = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  return {
    isPending,
    setValue,
    onAuth,
    watch,
    register,
    errors,
  };
};

export default useAuth;