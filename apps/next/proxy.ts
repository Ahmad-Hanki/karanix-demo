import { withHeadersProxy } from "./proxies/with-headers-proxy";
import { stackProxies } from "./proxies/stack-proxies";
import { authProxy } from "./proxies/auth-proxy";

const proxies = [withHeadersProxy, authProxy];

export default stackProxies(proxies);

export const config = {
  matcher: [
    {
      source:
        "/((?!api|trpc|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|xml|txt|json|csv|docx?|xlsx?|zip|webmanifest)).*)",
    },
  ],
};
