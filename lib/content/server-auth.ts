import { auth, clerkClient } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { roleFromMetadata, type Role } from "@/lib/content/roles";

export async function getAuthedSupabase(): Promise<{
  userId: string;
  supabase: SupabaseClient;
}> {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("ยังไม่ได้เข้าสู่ระบบ");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      accessToken: async () => (await getToken({ template: "supabase" })) ?? null,
    },
  );

  return { userId, supabase };
}

export async function getUserRole(): Promise<Role> {
  const { userId } = await auth();
  if (!userId) return "user";
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return roleFromMetadata(user.publicMetadata);
}
