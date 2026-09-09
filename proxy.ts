import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: middleware.ts가 proxy.ts로 이름이 바뀌었다 (CLAUDE.md 참고).
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL?.toLowerCase();
  const isAllowedAdmin = !!user?.email && !!allowedEmail && user.email.toLowerCase() === allowedEmail;

  if (!isAllowedAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
