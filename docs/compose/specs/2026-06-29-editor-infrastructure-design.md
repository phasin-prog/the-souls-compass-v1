# Editor Infrastructure Design

## [S1] Problem

The editor page currently has three gaps:
1. **No image support** — ImagePicker component and R2 upload API exist but are not wired to the editor
2. **Cache layer unused** — Upstash Redis cache is built but not connected to content-fetching code
3. **Clerk JWT exposed to client** — Clerk JWT is sent from client-side to Supabase for RLS, visible in browser DevTools (F12)

## [S2] Solution overview

Three changes, delivered incrementally:

### [S2a] Clerk Webhook → Supabase Sync
- Create `app/api/webhooks/clerk/route.ts` to receive Clerk webhooks (user.created, user.updated, user.deleted)
- Sync user data to `profiles` table in Supabase (clerk_user_id, username, display_name)
- Verify webhook signatures using `svix` package
- Clerk remains the auth UI provider (login/register/UserButton)

### [S2b] Image Upload in Editor
- Add `cover_image` column (text, nullable) to `entries` table via migration
- Add `coverImage` field to `EditorDraft` type
- Wire existing `<ImagePicker>` component into editor page
- Upload via existing `/api/upload` server-side route (R2 credentials stay server-side)

### [S2c] Wire Upstash Cache
- Connect existing `cached()` + `invalidateEntry()` from `lib/cache/` into `public-source.ts`
- Cache published entries with 300s TTL
- Invalidate cache on publish via `invalidateEntry(slug)`

## [S3] Auth flow (critical change)

**Before:** Client-side Clerk JWT → Supabase RLS (`auth.jwt()->>'sub'`)
**After:** All Supabase operations move to server-side (Server Actions / API Routes)

- Clerk JWT stays on server only — never exposed to client
- Editor page calls Server Actions instead of Supabase client directly
- RLS still uses `auth.jwt()->>'sub'` but the JWT comes from server-side Clerk session

### Server Actions needed:
- `saveDraftAction(draft)` — save/update draft
- `loadDraftAction(slug)` — load draft by slug
- `publishAction(draft)` — publish entry
- `loadRevisionsAction(entryId)` — load revision history
- `restoreRevisionAction(revisionId)` — restore from revision
- `listMyEntriesAction()` — list current user's entries

### Image upload:
- Use existing `/api/upload` route (already server-side, already Clerk-authed)

## [S4] Components

### Files to create:
| File | Purpose |
|---|---|
| `app/api/webhooks/clerk/route.ts` | Clerk webhook handler |
| `app/studio/editor/actions.ts` | Server Actions for editor |
| `lib/content/server-auth.ts` | Helper to get Clerk userId on server + create Supabase client |

### Files to modify:
| File | Change |
|---|---|
| `app/studio/editor/page.tsx` | Remove direct Supabase calls, use Server Actions; wire ImagePicker |
| `lib/content/draft-db.ts` | Add `coverImage` to row mapping |
| `lib/content/draft-mapper.ts` | Add `coverImage` field mapping |
| `lib/content/publish-validation.ts` | Add `coverImage` to EditorDraft type |
| `lib/content/public-source.ts` | Wire `cached()` from Upstash cache layer |
| `supabase/schema.sql` | Add `cover_image` column to `entries` table |
| `components/studio/image-picker.tsx` | Ensure it works with server-side upload |

### Dependencies to install:
- `svix` — Clerk webhook signature verification

## [S5] Data flow

### Editor save flow (after):
```
User edits → setDraft() → autosave debounce 2.5s
  → call saveDraftAction(draft) [Server Action]
    → auth() from Clerk [server-side]
    → createServerSupabase() with Clerk JWT [server-side]
    → upsert to Supabase
  → return success
```

### Image upload flow (after):
```
User drops image in ImagePicker
  → POST /api/upload [existing route]
    → Clerk auth() check [server-side]
    → uploadToR2(buffer, fileName, contentType) [server-side]
    → return { url, key }
  → ImagePicker updates draft.coverImage
```

### Cache flow (after):
```
getPublishedEntries() / getPublishedEntryBySlug()
  → cached(key, fetchFresh, 300)
    → check Upstash Redis
    → if miss: fetch from Supabase → cache result
    → return cached data

publishEntry() → invalidateEntry(slug) → delete from Upstash
```

## [S6] Error handling

- Clerk webhook: return 400 on invalid signature, 200 on success
- Server Actions: throw on auth failure, return structured errors for validation
- R2 upload: existing validation (MIME type, 10MB limit) stays unchanged
- Cache: graceful fallback — if Upstash is down, read directly from Supabase (no cache)

## [S7] Testing

- Clerk webhook: test with `svix` CLI or mock payload
- Server Actions: test save/load/publish flows via editor UI
- Image upload: test drag-drop + click upload in editor
- Cache: verify cache hit/miss behavior, verify invalidation on publish
- Build: `npm run build` + `npm run lint` must pass

## [S8] Migration plan

1. Install `svix` package
2. Create `lib/content/server-auth.ts` (server-side auth helper)
3. Create `app/studio/editor/actions.ts` (Server Actions)
4. Migrate editor page to use Server Actions (remove direct Supabase calls)
5. Add `cover_image` column to `entries` table
6. Wire `<ImagePicker>` into editor
7. Wire Upstash cache into `public-source.ts`
8. Create `app/api/webhooks/clerk/route.ts`
9. Run `npm run build` + `npm run lint`
