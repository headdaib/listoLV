import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { locales, defaultLocale } from "@/i18n/request";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const protectedPaths = ["/dashboard", "/admin"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check protected paths (strip locale prefix)
  const pathnameWithoutLocale = pathname.replace(/^\/(?:ru|lv|en)/, "");
  const isProtected = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p));

  if (isProtected) {
    const session = await auth();
    if (!session) {
      const locale = pathname.split("/")[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
