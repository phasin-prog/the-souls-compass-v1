import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// ป้องกันเฉพาะ /studio (ต้อง login)
const isProtectedRoute = createRouteMatcher(["/studio(.*)"]);

// ถ้ายังไม่ได้ตั้งคีย์ Clerk ใน env ให้ middleware ผ่านเฉย ๆ (public site ไม่ล่ม 500)
// /studio จะถูกป้องกันจริงเมื่อใส่คีย์ครบ
const hasClerk =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!hasClerk) {
    return NextResponse.next();
  }
  return clerk(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
