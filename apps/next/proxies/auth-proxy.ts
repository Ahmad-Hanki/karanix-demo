import { getAuthCookieServer } from "@/lib/auth-cookies";
import { NextProxy, ProxyFactory } from "@/types";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const signInPath = "/auth/sign-in";

export const authProxy: ProxyFactory = (next: NextProxy) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const baseUrl = request.nextUrl.origin;
    const pathname = request.nextUrl.pathname;

    const cookie = await getAuthCookieServer();

    // No cookie → protected route? Redirect to login
    if (!cookie && pathname != signInPath) {
      const signInUrl = new URL(
        "/auth/sign-in?redirect=" + encodeURIComponent(pathname),
        baseUrl
      );
      return NextResponse.redirect(signInUrl);
    }

    // Continue to the next proxy in the chain
    return next(request, event);
  };
};
