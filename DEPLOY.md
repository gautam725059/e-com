# Going live (Vercel + Supabase + domain)

The storefront now reads products from **Supabase** (with a local `products.json`
fallback so the site never breaks). Admin add/edit/delete/upload + stock all
write to Supabase, so they work on Vercel where the filesystem is read-only.

## 1. Supabase setup (one time)

1. Open **Supabase Dashboard → SQL Editor → New query**.
2. Paste the contents of [`supabase/setup.sql`](supabase/setup.sql) and click **Run**.
   - Creates the `products` table, public-read policy, seeds the 6 products,
     and creates the public `product-images` storage bucket.
3. Get your **service role key**: Dashboard → **Project Settings → API** →
   copy the `service_role` secret (NOT the anon key).

## 2. Environment variables

Add these to `.env.local` (for local dev) **and** to Vercel (for production):

```
NEXT_PUBLIC_SUPABASE_URL=...            # already have
NEXT_PUBLIC_SUPABASE_ANON_KEY=...       # already have
NEXT_PUBLIC_RAZORPAY_KEY_ID=...         # already have
RAZORPAY_KEY_SECRET=...                 # already have
SUPABASE_SERVICE_ROLE_KEY=...           # NEW — required for admin writes/uploads
```

> The service role key is server-only (no `NEXT_PUBLIC_`). Never expose it client-side.

## 3. Deploy to Vercel

```bash
git add -A
git commit -m "Supabase-backed products + live admin"
git push origin master
```

1. [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project** →
   import `gautam725059/e-com`.
2. **Settings → Environment Variables** → add all 5 vars from step 2.
3. **Deploy** → live at `your-app.vercel.app`.

## 4. Connect your domain

1. Vercel project → **Settings → Domains** → add `yourdomain.com`.
2. Vercel shows the DNS records to add (apex `A 76.76.21.21`, `www` CNAME
   `cname.vercel-dns.com` — use whatever Vercel shows).
3. Add those records at your registrar (GoDaddy / Namecheap / Hostinger → DNS).
4. Wait for propagation; HTTPS is issued automatically.

## 5. Razorpay live mode

Current keys are **test** (`rzp_test_...`). For real payments, complete Razorpay
KYC, generate **Live** keys (`rzp_live_...`), and replace `NEXT_PUBLIC_RAZORPAY_KEY_ID`
+ `RAZORPAY_KEY_SECRET` in Vercel.

## Admin login

`/admin` → username `admin`, password `test@1234` (stored in `src/data/admins.json`).
Change this before going live.
