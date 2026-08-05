import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip studio, API, and static assets
  matcher: ["/", "/(en|hu|de|fr|es|ru)/:path*", "/((?!studio|api|_next|_vercel|.*\\..*).*)"],
};
