# Daily Stoic — AI-Powered Meditations

A minimal, beautiful web app that generates a fresh Stoic reflection each day using Claude, cached in Supabase, and deployed on Vercel.

---

## Architecture

```
Browser → Next.js API Route → Anthropic Claude API
                            → Supabase (cache)
```

Each day, the first visitor triggers a Claude API call. The result is cached in Supabase so subsequent visitors get the same reflection instantly without additional API costs.

---

## Deployment Guide

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and open your project (or create one).
2. Navigate to **SQL Editor** in the left sidebar.
3. Paste the contents of `supabase-migration.sql` and click **Run**.
4. Go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://abc123.supabase.co`)
   - **service_role key** (under "Project API keys" — the `service_role` one, NOT `anon`)

### Step 2 — Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key under **API Keys**
3. Add some credits under **Billing** (even $5 will last a very long time for this app)

### Step 3 — Push to GitHub

```bash
cd daily-stoic
git init
git add .
git commit -m "Initial commit"
gh repo create daily-stoic --public --push
```

Or create a repo on github.com manually and push to it.

### Step 4 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `daily-stoic` GitHub repo
3. Framework Preset will auto-detect **Next.js**
4. Under **Environment Variables**, add these three:

   | Key | Value |
   |-----|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |

5. Click **Deploy**

Your app will be live at `https://daily-stoic.vercel.app` (or whatever name you choose).

---

## Local Development

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

- Each day of the year maps to a **theme** (31 rotating topics) and a **philosopher** (8 Stoics)
- The first request of the day calls Claude to generate a reflection
- The result is cached in Supabase's `reflections` table keyed by `(date, philosopher)`
- All subsequent requests that day return the cached version instantly
- API cost: ~$0.003 per generation → about $1/year

---

## Customization

- **Add themes**: Edit the `STOIC_THEMES` array in `app/page.js`
- **Add philosophers**: Edit the `PHILOSOPHERS` array in `app/page.js`
- **Change the model**: Edit `model` in `app/api/generate/route.js`
- **Custom domain**: Add one in Vercel → Settings → Domains
