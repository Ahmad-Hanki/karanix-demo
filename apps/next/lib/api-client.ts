import {
  getAuthCookieClient,
  getAuthCookieServer,
  clearAuthCookie,
  deleteAuthCookieServer,
} from "@/lib/auth-cookies";
import xior, { XiorError } from "xior";
import { realIP } from "./real-api";

declare module "xior" {
  interface XiorRequestConfig {
    auth?: boolean;
  }
}

export const restApi = xior.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 🧩 REQUEST INTERCEPTOR — attach token and headers
restApi.interceptors.request.use(async (config) => {
  const IS_SERVER = typeof window === "undefined";
  const shouldAuth = config.auth === undefined || config.auth === true;
  if (!shouldAuth) return config;

  let ip: string | undefined;
  let cookie:
    | Awaited<ReturnType<typeof getAuthCookieServer>>
    | ReturnType<typeof getAuthCookieClient>
    | null;

  if (IS_SERVER) {
    const { headers } = await import("next/headers");
    ip = realIP(await headers(), true);
    cookie = await getAuthCookieServer();
  } else {
    cookie = getAuthCookieClient();
  }

  config.headers = {
    ...config.headers,
    ...(cookie && { Authorization: `Bearer ${cookie.accessToken}` }),
    ...(ip && { "X-Real-IP": ip }),
  };

  return config;
});

// 🧩 RESPONSE INTERCEPTOR — handle global HTTP / REST errors
restApi.interceptors.response.use(
  (response) => response,
  async (error: XiorError) => {
    const status = error.response?.status;
    const data = error.response?.data as any;

    // Try to extract a useful error message from REST response
    const message =
      data?.message ??
      data?.error ??
      (Array.isArray(data?.errors) ? data.errors[0]?.message : undefined) ??
      error.message;

    console.error("❌ API Error:", {
      status,
      data,
      message,
    });

    const isUnauthorized = status == 401;

    if (isUnauthorized) {
      const IS_SERVER = typeof window === "undefined";

      try {
        if (IS_SERVER) {
          await deleteAuthCookieServer();
        } else {
          clearAuthCookie();
          // Optional: redirect user to login page (client only)
          if (typeof window !== "undefined") {
            window.location.href = "/auth/sign-in";
          }
        }
      } catch (err) {
        console.error("⚠️ Failed to delete auth cookies:", err);
      }
    }

    throw error;
  }
);
