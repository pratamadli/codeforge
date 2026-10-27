import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ce_session";
const PROTECTED = [/^\/kurikulum/, /^\/pelajaran/, /^\/soal/, /^\/progress/];

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) return null;
  return new TextEncoder().encode(value);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const key = secret();
  let authed = false;
  if (token && key) {
    try {
      await jwtVerify(token, key);
      authed = true;
    } catch {
      authed = false;
    }
  }

  const isProtected = PROTECTED.some((pattern) => pattern.test(pathname));
  if (isProtected && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/masuk";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (authed && (pathname === "/masuk" || pathname === "/daftar")) {
    return NextResponse.redirect(new URL("/kurikulum", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/kurikulum/:path*", "/pelajaran/:path*", "/soal/:path*", "/progress", "/masuk", "/daftar"],
};
