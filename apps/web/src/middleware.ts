import { NextResponse } from "next/server";

// PREVIEW MODE: Clerk devre dışı (gerçek key girilince eski middleware.ts kullan)
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
