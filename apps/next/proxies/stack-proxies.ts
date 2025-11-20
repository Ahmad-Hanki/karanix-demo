// proxies/stack-proxies.ts
import { NextProxy, ProxyFactory } from "@/types";
import { NextResponse } from "next/server";

export function stackProxies(
  functions: ProxyFactory[] = [],
  index = 0
): NextProxy {
  const current = functions[index];

  if (current) {
    const next = stackProxies(functions, index + 1);
    return current(next);
  }

  return () => NextResponse.next();
}
