import { NextProxy, ProxyFactory } from "@/types";
import { NextResponse, NextFetchEvent, NextRequest } from "next/server";

export const withHeadersProxy: ProxyFactory = (next: NextProxy) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // Call the next proxy in the chain
    const res = await next(request, event);

    // Ensure there’s a valid response
    if (!res) return NextResponse.next();

    // Clone the response so we can safely modify headers
    const response = new NextResponse(res.body, res);

    // ✅ Security and metadata headers
    response.headers.set("x-content-type-options", "nosniff");
    response.headers.set("x-dns-prefetch-control", "false");
    response.headers.set("x-download-options", "noopen");
    response.headers.set("x-frame-options", "SAMEORIGIN");

    // Include current path
    response.headers.set(
      "x-current-path",
      request.url.toString().replace(request.nextUrl.origin, "")
    );

    response.headers.set(
      "strict-transport-security",
      "max-age=63072000; includeSubDomains; preload"
    );
    response.headers.set("referrer-policy", "no-referrer");
    response.headers.set(
      "permissions-policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  };
};
