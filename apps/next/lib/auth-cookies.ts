import { Role } from "@/types";
import { CookieValueTypes, setCookie, deleteCookie } from "cookies-next";
import { getCookie } from "cookies-next/client";

export const setAuthCookie = (cookie: CookieValueTypes, role: Role) => {
  const cookieValue = encodeURIComponent(
    JSON.stringify({
      accessToken: cookie,
      role: role,
    })
  );

  setCookie("_auth", cookieValue, {
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const getAuthCookieClient = (): {
  accessToken: string;
  role: Role;
} | null => {
  const cookie = getCookie("_auth");
  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie as string));
  } catch {
    return null;
  }
};

export const getAuthCookieServer = async (): Promise<{
  accessToken: string;
  role: Role;
} | null> => {
  const { cookies } = await import("next/headers");
  const cookie = (await cookies()).get("_auth")?.value;
  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return null;
  }
};

export const clearAuthCookie = () => {
  deleteCookie("_auth");
};

export const deleteAuthCookieServer = async () => {
  const { cookies } = await import("next/headers");
  (await cookies()).delete("_auth");
};
