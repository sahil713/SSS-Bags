# Deploy SSS BAGS Online (for College / Portfolio)

Use this guide to put your project on the internet so you can share a **live link** and **GitHub repo** in college.

---

## 1. Put Your Code on GitHub

1. Create a new repository on [GitHub](https://github.com/new). Name it e.g. `sss-bags` or `sss-bags-ecommerce`.
2. In your project folder, run:

```bash
cd "/data/cool/projects/SSS BAGS"
git init
git add .
git commit -m "Initial commit: SSS BAGS e-commerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

**Share this link:** `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME` — good for showing code in college.

---

## 2. Deploy Backend + Database (Render.com – Free)

[Render](https://render.com) has a free tier for web services and PostgreSQL.

### 2.1 Create a PostgreSQL database

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **PostgreSQL**.
2. Name it e.g. `sss-bags-db`.
3. Create. Copy the **Internal Database URL** (you’ll use it for the backend)."
dpg-d6e30eggjchc738fek4g-a -> hostname
5432 -> port 
sss_bags_db -> database
sss_bags_db_user ->username 
OJOQ3hCaYRWqZuCakMIt4fLXYmm2TT7G -> password 
postgresql://sss_bags_db_user:OJOQ3hCaYRWqZuCakMIt4fLXYmm2TT7G@dpg-d6e30eggjchc738fek4g-a/sss_bags_db -> internal database url 
postgresql://sss_bags_db_user:OJOQ3hCaYRWqZuCakMIt4fLXYmm2TT7G@dpg-d6e30eggjchc738fek4g-a.oregon-postgres.render.com/sss_bags_db -> external database url 
PGPASSWORD=OJOQ3hCaYRWqZuCakMIt4fLXYmm2TT7G psql -h dpg-d6e30eggjchc738fek4g-a.oregon-postgres.render.com -U sss_bags_db_user sss_bags_db -> psql command 

### 2.2 Deploy the Rails API

**Where:** [Render Dashboard](https://dashboard.render.com) (log in or sign up).

**Step 1 – Create a Web Service**

- On the dashboard, click the blue **New +** button (top right).
- In the menu, click **Web Service**.
- You’ll see “Connect a repository”.

**Step 2 – Connect GitHub**

- If GitHub isn’t connected, click **Connect GitHub** and authorize Render.
- In the list of repos, find your SSS BAGS repo and click **Connect** next to it.
- **Where to find it:** Repos are listed by name; use the search box if needed.

**Step 3 – Configure the service (where each setting is)**

After you connect the repo, you’ll see a form. Use these values and know where they are:

| What to set | Where to find it | Value to use |
|-------------|------------------|--------------|
| **Name** | At the top of the form | e.g. `sss-bags-api` (this becomes part of your URL). |
| **Region** | Dropdown | Pick one close to you (e.g. Oregon). |
| **Branch** | Under the repo name | Usually `main`. |
| **Root Directory** | **Advanced** section (click to expand) | Type: `backend` (so Render builds only the Rails app). |
| **Runtime** | In the main form | Select **Ruby**. |
| **Build Command** | In the form | `bundle install` |
| **Start Command** | In the form | `bundle exec puma -C config/puma.rb -p $PORT` |
| **Pre-deploy command** | **Settings** → same section as Build/Start (see below) | `bin/rails db:migrate` — runs before each deploy so the DB is up to date. **Only on paid plans.** On the free tier this field is not available; use the Start Command workaround below instead. |

**Step 4 – Add environment variables**

- Scroll to **Environment** or the **Environment Variables** section.
- Click **Add Environment Variable** (or **+ Add**) for each of these:

| Key | Where to get the value | Example / note |
|-----|------------------------|-----------------|
| `RAILS_ENV` | You type it | `production` |
| `SECRET_KEY_BASE` | On your computer run: `openssl rand -hex 64` | Paste the long string. **Required** — Rails needs this in production. |
| `DATABASE_URL` | From step 2.1: in your PostgreSQL service, open **Info** and copy **Internal Database URL** | Paste the full URL (starts with `postgresql://`). |
| `JWT_SECRET` | On your computer run: `openssl rand -hex 32` | Paste the long string (e.g. `a1b2c3...`). |
| `CORS_ORIGINS` | You’ll set this later | For now use a placeholder: `https://your-app.vercel.app` — replace with your real Vercel URL after deploying the frontend. |
| `REDIS_URL` | Optional | Leave blank, or use a free Redis URL from [Upstash](https://upstash.com) if you want Sidekiq. |

**Release / Pre-deploy command (migrations)**

- Render uses **Pre-deploy command** (Heroku called it "Release Command"). It runs before each deploy (e.g. `bin/rails db:migrate`).
- **Where to find it:** Dashboard → your backend **Web Service** → **Settings**. In the same section as Build Command and Start Command, look for **Pre-deploy command**. If you don’t see it, your plan may not include it.
- **Free tier:** Pre-deploy is only available on **paid** web services. On the free tier, run migrations in the **Start Command** instead:  
  `bin/rails db:migrate && bundle exec puma -C config/puma.rb -p $PORT`

**Step 5 – Deploy**

- Click **Create Web Service** (bottom of the page).
- Render will build and deploy. **Where to see progress:** the **Logs** tab on the service page.
- When the build succeeds, **where to find your URL:** at the top of the service page, e.g. `https://sss-bags-api.onrender.com`. Copy this URL; the frontend will use it.

https://sss-bags.onrender.com

74.220.48.0/24
74.220.56.0/24

---

## 3. Deploy Frontend (Vercel – Free)

1. **[Vercel](https://vercel.com)** → sign in with GitHub → **Add New** → **Project** → select the same repo.
2. **Settings:** Root Directory = `frontend`, Framework = Vite, Build = `npm run build`, Output = `dist`.
3. **Env:** Add `VITE_API_URL` = your Render backend URL including the API path (e.g. `https://sss-bags.onrender.com/api/v1`).
4. **Deploy** → copy your frontend URL (e.g. `https://sss-bags.vercel.app`).
5. **Render** → backend → **Environment** → set `CORS_ORIGINS` = that Vercel URL → redeploy backend.

https://sss-bags-nine.vercel.app/products

---

## 4. Run Migrations and Seed (Backend)

After the first deploy, run migrations and seed once:

1. Render → your backend service → **Shell** (or use “Manual Deploy” with a build command that runs migrations).
2. Or install [Render CLI](https://render.com/docs/cli) and run:

```bash
# If you have Render CLI and a shell to the service:
bin/rails db:migrate db:seed
```

If Render doesn’t give you a shell, add this to the **Build Command** so it runs on every deploy:

```bash
bundle install && bin/rails db:migrate
```

Then in the dashboard, run **one-off** seed (or add `db:seed` to the build once, then remove it):

```bash
bin/rails db:seed
```

**Default admin after seed:** `admin@sssbags.com` / `admin123`.

---

## 5. What to Share in College

| What | Link |
|------|------|
| **Live app** | Your Vercel URL, e.g. `https://sss-bags.vercel.app` |
| **Source code** | Your GitHub repo URL |
| **Short description** | “Full-stack e-commerce (Rails API + React). Deployed on Render + Vercel.” |

---

## 6. Optional: Redis and Sidekiq

- **Without Redis:** The app will run; background jobs (e.g. email verification) may not run. Fine for a demo.
- **With Redis (free):** Create a free Redis database at [Upstash](https://upstash.com), copy the URL, and set `REDIS_URL` in Render. Then Sidekiq can run.

---

## 7. Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render: PostgreSQL created
- [ ] Render: Backend web service deployed, `SECRET_KEY_BASE`, `DATABASE_URL`, and `JWT_SECRET` set
- [ ] Vercel: Frontend deployed, `VITE_API_URL` = backend URL
- [ ] Backend: `CORS_ORIGINS` = your Vercel URL
- [ ] Backend: `db:migrate` and `db:seed` run
- [ ] Test: Open Vercel URL, sign up / log in (admin: `admin@sssbags.com` / `admin123`)

---

## Troubleshooting

- **CORS errors in browser:** Make sure `CORS_ORIGINS` on Render exactly matches your Vercel URL (including `https://`).
- **API 404:** Ensure `VITE_API_URL` has no trailing slash and no `/api/v1` (the app adds that).
- **Database errors:** Confirm `DATABASE_URL` in Render is the **Internal** URL from the PostgreSQL service.
- **"Missing secret_key_base for production":** Add env var `SECRET_KEY_BASE` on Render. Generate with: `openssl rand -hex 64`, then paste the value and redeploy.
- **"Missing service adapter for S3":** The app now uses local disk storage in production when AWS is not set, so you don’t need S3 on Render. Product image uploads will work; they are stored on the server (ephemeral on Render, so they may be lost on redeploy). For permanent storage later, add the `aws-sdk-s3` gem and set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_BUCKET`.

Good luck with your college showcase.
