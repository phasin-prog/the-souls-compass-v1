import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ป้องกันเฉพาะ /studio (ต้อง login) — หน้า public อื่นเข้าได้ปกติ
const isProtectedRoute = createRouteMatcher(["/studio(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // ข้าม static files และ _next; รันกับ route อื่นทั้งหมด
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
