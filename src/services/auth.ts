import { env } from "@/env";

export interface LoginResult {
  success: boolean;
  data?: {
    apiKey: string;
  };
  error?: string;
}

// Validate API Key by calling New-API /v1/models
export const login = async (apiKey: string): Promise<LoginResult> => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/v1/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      return { success: true, data: { apiKey } };
    }

    if (res.status === 401 || res.status === 403) {
      return { success: false, error: "API Key 无效，请检查后重试" };
    }

    return { success: false, error: `服务器返回错误 (${res.status})` };
  } catch {
    return { success: false, error: "无法连接到乾羲 API，请检查网络" };
  }
};