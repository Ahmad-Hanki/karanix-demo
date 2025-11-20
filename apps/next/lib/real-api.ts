// lib/real-ip.ts
const FALLBACK_IP_ADDRESS = "0.0.0.0";

export function realIP(headers: Headers, cfProxy = false): string {
  let ip: string | undefined;

  if (cfProxy && headers.has("cf-connecting-ip")) {
    ip = headers.get("cf-connecting-ip")!;
  } else if (headers.has("x-real-ip")) {
    ip = headers.get("x-real-ip")!;
  } else if (headers.has("x-forwarded-for")) {
    ip = headers.get("x-forwarded-for")!.split(",")[0].trim();
  } else if (headers.has("x-vercel-forwarded-for")) {
    ip = headers.get("x-vercel-forwarded-for")!;
  } else if (headers.has("x-vercel-proxied-for")) {
    ip = headers.get("x-vercel-proxied-for")!;
  }

  // Normalize IPv6 localhost to IPv4 localhost
  if (ip === "::1") {
    return "127.0.0.1";
  }

  return ip ?? FALLBACK_IP_ADDRESS;
}
