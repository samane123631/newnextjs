import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["de", "en", "fa"],
  defaultLocale: "de"
});

export const config = {
  matcher: ['/', '/(de|en|fa)/:path*']
};