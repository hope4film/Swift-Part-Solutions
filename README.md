# SPS Waitlist Landing Page

Static waitlist page for [swiftpartsolutions.com](https://swiftpartsolutions.com). Collects early-access signups and stores them in Supabase.

## File structure

```
landing/
├── waitlist/
│   ├── index.html      ← the page (Tailwind CDN, Font Awesome, no build step)
│   └── waitlist.js     ← form validation + Supabase insert (ES module)
├── supabase/
│   └── waitlist_signups.sql  ← table + RLS migration
├── base.html           ← existing FastAPI app template (not used by waitlist)
├── TXVBuilder.tsx       ← existing React component (not used by waitlist)
└── README.md
```

## Quick start

1. **Create the Supabase table.** Run `supabase/waitlist_signups.sql` in your Supabase SQL editor.
2. **Add your keys.** In `waitlist/index.html`, replace the two placeholders in `window.__SPS_SUPABASE__`:
   - `url` → your Supabase project URL (e.g. `https://abcdef.supabase.co`)
   - `anonKey` → your project's **anon / public** key
3. **Open locally.** Just open `waitlist/index.html` in a browser — no server required.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set the source to the branch and folder that contains `waitlist/index.html`.
   - If the repo root is the site root, the page will be at `/waitlist/`.
   - If you set the Pages root to `/waitlist`, it will be at `/`.
4. Optionally configure a custom domain (`swiftpartsolutions.com`).

### Keeping keys out of the repo

The Supabase **anon key is public by design** — security comes from RLS, not from hiding the key. That said, if you prefer not to commit it:

- **Option A (simple):** Add it before committing, keep the repo private.
- **Option B (GitHub Actions):** Use a deploy workflow that injects `SUPABASE_URL` and `SUPABASE_ANON_KEY` secrets into the HTML at build time.
- **Option C (Edge Function):** Move the insert to a Supabase Edge Function. The page POSTs to the function URL instead of using the client SDK. This hides table structure entirely and lets you add server-side validation (e.g. rate limiting, email verification).

## TODOs before launch

- [ ] Replace Supabase URL and anon key placeholders in `waitlist/index.html`
- [ ] Replace TXV Builder link (`href="#"` in the "Try a Free Tool" section) with the real URL
- [ ] Replace contact email in the footer (`hello@swiftpartsolutions.com`) if different
- [ ] Update copyright year if needed (currently 2025)
- [ ] Optionally add a favicon / OG image meta tags for social sharing

## Form fields → table columns

| Form field | Column | Required |
|---|---|---|
| First name | `first_name` | Yes |
| Last name | `last_name` | Yes |
| Email | `email` | Yes (unique) |
| Field type | `field_type` | Yes |
| Display name | `display_name` | No |
| Company | `company_name` | No |
| Phone | `phone` | No |
| Biggest headache | `biggest_parts_headache` | No |
| Consent checkbox | `consent` | Yes (always `true`) |

Duplicate emails receive a friendly "already on the list" message instead of an error.

## Future: migrating to real accounts

When you're ready to onboard waitlist users:

1. Query `waitlist_signups` for approved emails.
2. Create `auth.users` entries (invite flow or magic link).
3. Populate `profiles` from the waitlist row (`display_name`, `company_name`, etc.).
4. Optionally add a `migrated_at` column to `waitlist_signups` to track which rows have been converted.
