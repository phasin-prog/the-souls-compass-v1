# Editor Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire image upload (R2), Upstash cache, and Clerk webhook into the editor; move all Supabase operations server-side to hide Clerk JWT from the client.

**Architecture:** All Supabase writes move to Server Actions called from the editor page. Clerk JWT stays server-only. ImagePicker (already built) gets wired into the editor via a new `coverImage` field. Upstash cache gets wired into public content reads.

**Tech Stack:** Next.js Server Actions, Supabase, Cloudflare R2, Upstash Redis, Clerk webhooks, svix

---

### Task 1: Server Auth Helper

**Covers:** [S3]

**Files:**
- Create: `lib/content/server-auth.ts`

- [ ] **Step 1: Create server auth helper**

```typescript
// lib/content/server-auth.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side: get Clerk userId + create Supabase client with Clerk JWT.
 * Use in Server Actions / API routes only — never in client components.
 */
export async function getAuthedSupabase() {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      accessToken: async () => (await getToken({ template: "supabase" })) ?? null,
    },
  );

  return { userId, supabase };
}

/**
 * Server-side: get Clerk user role from publicMetadata.
 */
export async function getUserRole(): Promise<string> {
  const { userId } = await auth();
  if (!userId) return "user";
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata?.role as string) ?? "user";
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/content/server-auth.ts`
Expected: no errors (or only env-related warnings)

- [ ] **Step 3: Commit**

```bash
git add lib/content/server-auth.ts
git commit -m "feat: add server-side auth helper for Supabase with Clerk JWT"
```

---

### Task 2: Add coverImage to Data Model

**Covers:** [S2b]

**Files:**
- Modify: `lib/content/publish-validation.ts` (add `coverImage` to `EditorDraft` + `EMPTY_DRAFT`)
- Modify: `lib/content/draft-mapper.ts` (add mapping in `draftToRow` + `entryToDraft`)
- Modify: `lib/content/entry-mapper.ts` (add `cover_image` to `EntryRow`)
- Modify: `types/content.ts` (add `coverImage` to `ContentEntry`)
- Modify: `supabase/schema.sql` (add `cover_image` column)

- [ ] **Step 1: Add coverImage to EditorDraft type**

In `lib/content/publish-validation.ts`, add to `EditorDraft` type (after `rootsCaution`):

```typescript
  rootsCaution: string;
  coverImage: string;  // R2 URL or empty
```

Add to `EMPTY_DRAFT`:

```typescript
  rootsCaution: "",
  coverImage: "",
```

- [ ] **Step 2: Add cover_image to EntryRow**

In `lib/content/entry-mapper.ts`, add to `EntryRow` type (after `related_cta`):

```typescript
  related_cta: RelatedCTA | null;
  cover_image: string | null;
```

Add to `rowToEntry` function (after `bodyMarkdown`):

```typescript
    bodyMarkdown: r.body_markdown ?? undefined,
    coverImage: r.cover_image ?? undefined,
```

- [ ] **Step 3: Add coverImage to ContentEntry type**

In `types/content.ts`, add to `ContentEntry` type (after `bodyMarkdown`):

```typescript
  bodyMarkdown?: string;
  coverImage?: string;
```

- [ ] **Step 4: Add mapping in draftToRow**

In `lib/content/draft-mapper.ts`, add to `draftToRow` return object (after `roots`):

```typescript
    roots: roots as EntryRow["roots"],
    cover_image: d.coverImage || null,
```

- [ ] **Step 5: Add mapping in entryToDraft**

In `lib/content/draft-mapper.ts`, add to `entryToDraft` return object (after `rootsCaution`):

```typescript
    rootsCaution: entry.roots?.caution ?? "",
    coverImage: entry.coverImage ?? "",
```

- [ ] **Step 6: Add cover_image column to schema**

In `supabase/schema.sql`, add after the `body_markdown` line in the `entries` table:

```sql
  body_markdown text,
  cover_image text,
```

- [ ] **Step 7: Commit**

```bash
git add lib/content/publish-validation.ts lib/content/draft-mapper.ts lib/content/entry-mapper.ts types/content.ts supabase/schema.sql
git commit -m "feat: add coverImage field to EditorDraft, EntryRow, and schema"
```

---

### Task 3: Server Actions for Editor

**Covers:** [S3]

**Files:**
- Modify: `app/studio/editor/actions.ts` (expand with all editor Server Actions)

- [ ] **Step 1: Expand actions.ts with all editor Server Actions**

Replace the contents of `app/studio/editor/actions.ts` with:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { getAuthedSupabase } from "@/lib/content/server-auth";
import { saveDraft as saveDraftDb, loadDraftBySlug, publishEntry } from "@/lib/content/draft-db";
import { addRevision, getRevisions } from "@/lib/content/entries-db";
import type { EditorDraft } from "@/lib/content/publish-validation";
import { invalidateEntry } from "@/lib/cache/cache";

// E7 — revalidate public pages after publish
export async function revalidatePublic(slug: string) {
  revalidatePath("/articles");
  revalidatePath("/concepts");
  if (slug && slug.trim() !== "") {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/concepts/${slug}`);
  }
}

// Save draft (autosave + manual save)
export async function saveDraftAction(draft: EditorDraft) {
  const { userId, supabase } = await getAuthedSupabase();
  const { data, error } = await saveDraftDb(supabase, userId, draft);
  if (error) return { error: error.message };
  return { data };
}

// Save draft + create revision snapshot
export async function saveDraftWithRevisionAction(draft: EditorDraft) {
  const { userId, supabase } = await getAuthedSupabase();
  const { data, error } = await saveDraftDb(supabase, userId, draft);
  if (error) return { error: error.message };
  const row = data as { id?: string } | null;
  const id = row?.id;
  if (id) {
    await addRevision(supabase, id, draft, userId, "บันทึกด้วยตนเอง");
  }
  return { data };
}

// Load draft by slug
export async function loadDraftAction(slug: string) {
  const { supabase } = await getAuthedSupabase();
  const draft = await loadDraftBySlug(supabase, slug);
  return { draft };
}

// Publish entry
export async function publishAction(draft: EditorDraft) {
  const { userId, supabase } = await getAuthedSupabase();
  const { data, error } = await publishEntry(supabase, userId, draft);
  if (error) return { error: error.message };
  const row = data as { id?: string } | null;
  const id = row?.id;
  if (id) {
    await addRevision(supabase, id, { ...draft, status: "published" }, userId, "เผยแพร่");
  }
  // Invalidate Upstash cache
  await invalidateEntry(draft.slug);
  // Revalidate public pages
  await revalidatePublic(draft.slug);
  return { data };
}

// Load revisions
export async function loadRevisionsAction(entryId: string) {
  const { supabase } = await getAuthedSupabase();
  const revisions = await getRevisions(supabase, entryId);
  return { revisions };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit app/studio/editor/actions.ts`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/studio/editor/actions.ts
git commit -m "feat: add server actions for editor (save/load/publish/revisions)"
```

---

### Task 4: Wire ImagePicker into Editor Page

**Covers:** [S2b]

**Files:**
- Modify: `app/studio/editor/page.tsx` (add ImagePicker + coverImage state)

- [ ] **Step 1: Import ImagePicker**

In `app/studio/editor/page.tsx`, add import (after the existing imports):

```typescript
import { ImagePicker } from "@/components/studio/image-picker";
```

- [ ] **Step 2: Add coverImage section in editor UI**

In the editor page, add a new section after the "Roots" section (before the preview section, around line 414). Insert:

```tsx
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">ภาพปก</h2>
            <ImagePicker
              value={draft.coverImage}
              onChange={(url) => set("coverImage", url)}
              onRemove={() => set("coverImage", "")}
            />
          </section>
```

- [ ] **Step 3: Commit**

```bash
git add app/studio/editor/page.tsx
git commit -m "feat: wire ImagePicker into editor for cover image upload"
```

---

### Task 5: Migrate Editor to Server Actions

**Covers:** [S3]

**Files:**
- Modify: `app/studio/editor/page.tsx` (replace direct Supabase calls with Server Actions)
- Modify: `lib/content/server-auth.ts` (remove `getUserRole` if unused)

- [ ] **Step 1: Remove Supabase client import and creation**

In `app/studio/editor/page.tsx`, remove these imports:
```typescript
// REMOVE: import { createClerkSupabaseClient } from "@/lib/supabase/client";
// REMOVE: import { saveDraft as saveDraftDb, loadDraftBySlug, publishEntry } from "@/lib/content/draft-db";
// REMOVE: import { addRevision } from "@/lib/content/entries-db";
```

Add Server Action imports:
```typescript
import {
  saveDraftAction,
  saveDraftWithRevisionAction,
  loadDraftAction,
  publishAction,
  revalidatePublic,
} from "./actions";
```

- [ ] **Step 2: Remove supabase client creation**

Remove the `useMemo` block that creates `supabase`:
```typescript
// REMOVE:
const supabase = useMemo(
  () => createClerkSupabaseClient(async () => (await session?.getToken()) ?? null),
  [session],
);
```

- [ ] **Step 3: Update loadDraftBySlug call in useEffect**

Replace the useEffect that loads draft (around line 96-110):

```typescript
  useEffect(() => {
    const slug =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("slug")
        : null;
    if (!slug) return;
    let active = true;
    (async () => {
      const { draft: loaded } = await loadDraftAction(slug);
      if (active && loaded) setDraft(loaded);
    })();
    return () => {
      active = false;
    };
  }, []);  // removed supabase dependency
```

- [ ] **Step 4: Update persist function**

Replace the `persist` function (around line 117-134):

```typescript
  async function persist(snapshot: boolean): Promise<boolean> {
    if (!userId || !canSave) return false;
    let result;
    if (snapshot) {
      result = await saveDraftWithRevisionAction(draft);
    } else {
      result = await saveDraftAction(draft);
    }
    if (result.error) {
      showError(`บันทึกไม่สำเร็จ: ${result.error}`);
      return false;
    }
    setFeedback(null);
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setSavedAt(new Date().toLocaleString("th-TH"));
    if (snapshot) {
      setReloadKey((k) => k + 1);
    }
    return true;
  }
```

- [ ] **Step 5: Update handlePublish function**

Replace the `handlePublish` function (around line 175-218):

```typescript
  async function handlePublish() {
    setPublishTried(true);
    if (!userId) {
      showError("ยังไม่ได้เข้าสู่ระบบ — เผยแพร่ไม่ได้");
      return;
    }
    if (!canSave) {
      showError("ต้องมี Title และ Slug ก่อนเผยแพร่");
      return;
    }
    if (!canPublish(getPublishChecklist(draft))) {
      showError("ยังเผยแพร่ไม่ได้ — ทำรายการใน Publish Checklist ให้ครบก่อน");
      return;
    }
    if (deadLinks.length > 0) {
      showError(
        `พบลิงก์เสีย (dead links) ${deadLinks.length} รายการ: ${deadLinks.join(", ")} — แก้หรือลบก่อนเผยแพร่`,
      );
      return;
    }
    setPublishing(true);
    const result = await publishAction(draft);
    if (result.error) {
      setPublishing(false);
      showError(`เผยแพร่ไม่สำเร็จ: ${result.error}`);
      return;
    }
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setDraft((d) => ({ ...d, status: "published" }));
    setSavedAt(new Date().toLocaleString("th-TH"));
    setPublishing(false);
    showSuccess("เผยแพร่แล้ว ✓");
  }
```

- [ ] **Step 6: Remove unused useSession import**

Remove `useSession` from the Clerk import since it's no longer needed:
```typescript
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
```

- [ ] **Step 7: Update MyContentSearch to not pass supabase**

The `<MyContentSearch>` component currently receives `supabase` prop. Check if it needs updating — if it uses the supabase client directly, it needs to be migrated too. For now, keep it as-is if it works with the existing client, or update it to use Server Actions.

- [ ] **Step 8: Commit**

```bash
git add app/studio/editor/page.tsx
git commit -m "refactor: migrate editor page to use Server Actions (no more client-side Supabase)"
```

---

### Task 6: Wire Upstash Cache into Public Content

**Covers:** [S2c]

**Files:**
- Modify: `lib/content/public-source.ts` (wrap with `cached()`)

- [ ] **Step 1: Wire cache into public-source.ts**

Replace the contents of `lib/content/public-source.ts`:

```typescript
import type { ContentEntry } from "@/types/content";
import {
  entries as staticEntries,
  getEntryBySlug as getStaticEntryBySlug,
} from "@/lib/content/entries";
import {
  getPublishedEntries,
  getPublishedEntryBySlug,
} from "@/lib/content/entries-db";
import { cached, KEYS } from "@/lib/cache/cache";

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function staticPublished(): ContentEntry[] {
  return staticEntries.filter((e) => e.status === "published");
}

export async function getPublicEntries(): Promise<ContentEntry[]> {
  if (hasSupabaseEnv()) {
    try {
      return await cached(KEYS.entries, async () => {
        const fromDb = await getPublishedEntries();
        return fromDb.length > 0 ? fromDb : null;
      });
    } catch {
      // DB เข้าถึงไม่ได้ — ใช้ static แทน
    }
  }
  return staticPublished();
}

export async function getPublicEntryBySlug(
  slug: string,
): Promise<ContentEntry | null> {
  if (hasSupabaseEnv()) {
    try {
      return await cached(KEYS.entryBySlug(slug), async () => {
        return getPublishedEntryBySlug(slug);
      });
    } catch {
      // DB เข้าถึงไม่ได้ — fallback ไป static
    }
  }
  return getStaticEntryBySlug(slug) ?? null;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/content/public-source.ts`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/content/public-source.ts
git commit -m "feat: wire Upstash cache into public content reads"
```

---

### Task 7: Clerk Webhook Route

**Covers:** [S2a]

**Files:**
- Create: `app/api/webhooks/clerk/route.ts`

- [ ] **Step 1: Install svix**

Run: `npm install svix`
Expected: package added to package.json

- [ ] **Step 2: Create Clerk webhook route**

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

type ClerkWebhookEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    username?: string;
    first_name?: string;
    last_name?: string;
  };
};

async function handleUserCreatedOrUpdated(event: ClerkWebhookEvent) {
  const sb = createServiceSupabase();
  const { id, username, first_name, last_name } = event.data;
  const displayName = [first_name, last_name].filter(Boolean).join(" ") || null;

  const { error } = await sb.from("profiles").upsert(
    {
      clerk_user_id: id,
      username: username ?? null,
      display_name: displayName,
    },
    { onConflict: "clerk_user_id" },
  );

  if (error) {
    console.error("Webhook sync error:", error);
  }
}

async function handleUserDeleted(event: ClerkWebhookEvent) {
  const sb = createServiceSupabase();
  const { error } = await sb
    .from("profiles")
    .delete()
    .eq("clerk_user_id", event.data.id);

  if (error) {
    console.error("Webhook delete error:", error);
  }
}

export async function POST(req: Request) {
  const headerStore = await headers();
  const svixId = headerStore.get("svix-id");
  const svixTimestamp = headerStore.get("svix-timestamp");
  const svixSignature = headerStore.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "");
  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated":
      await handleUserCreatedOrUpdated(event);
      break;
    case "user.deleted":
      await handleUserDeleted(event);
      break;
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit app/api/webhooks/clerk/route.ts`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/webhooks/clerk/route.ts package.json package-lock.json
git commit -m "feat: add Clerk webhook route to sync users to Supabase profiles"
```

---

### Task 8: DB Migration Script

**Covers:** [S2b]

**Files:**
- Create: `supabase/migrations/20260629_add_cover_image.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/20260629_add_cover_image.sql
-- Add cover_image column to entries table
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS cover_image text;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260629_add_cover_image.sql
git commit -m "feat: add cover_image column migration for entries table"
```

---

### Task 9: Build & Lint Verification

**Covers:** [S7]

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 3: Fix any issues**

If lint or build fails, fix the issues and re-run.

- [ ] **Step 4: Commit fixes if needed**

```bash
git add -A
git commit -m "fix: resolve lint/build issues from editor infrastructure changes"
```
