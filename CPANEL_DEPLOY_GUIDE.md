# PakEVFinder - cPanel Node.js & MySQL Deployment Guide

This guide provides step-by-step instructions for deploying **PakEVFinder** to shared hosting environments using **cPanel Setup Node.js App** (Phusion Passenger / CloudLinux) and **MySQL / MariaDB**.

---

## 1. Local Prerequisites & Build Process

Before uploading files to cPanel, run the production build locally to compile standalone assets:

```bash
# 1. Install dependencies
npm install

# 2. Validate Prisma Schema
npx prisma validate

# 3. Execute Standalone Production Build
npm run build
```

### What `npm run build` does:
1. Runs `next build` with `output: 'standalone'` and `images: { unoptimized: true }` configured in `next.config.js`.
2. Triggers the automatic `postbuild` script (`node scripts/postbuild.js`), which copies:
   - `public/` &rarr; `.next/standalone/public`
   - `.next/static/` &rarr; `.next/standalone/.next/static`

---

## 2. cPanel MySQL Database Setup

1. Log into your **cPanel**.
2. Open **MySQL® Database Wizard**.
3. Create a new database name: `youruser_pakevfinder`.
4. Create a database user and generate a secure password: `youruser_evdbuser`.
5. Grant **ALL PRIVILEGES** to the user for `youruser_pakevfinder`.
6. Note down your database connection string:
   ```env
   DATABASE_URL="mysql://youruser_evdbuser:YOUR_PASSWORD@127.0.0.1:3306/youruser_pakevfinder"
   ```

---

## 3. Uploading Files to cPanel

1. Open **cPanel File Manager**.
2. Create a folder for your application (e.g. `/home/youruser/pakevfinder`).
3. Zip the contents of `.next/standalone/` along with `prisma/` and `.env`:
   - `.next/standalone/` (all contents)
   - `prisma/`
   - `.env`
4. Upload the zip file to `/home/youruser/pakevfinder` and extract it.

---

## 4. cPanel Node.js App Manager Configuration

1. In cPanel, search for **Setup Node.js App** (Phusion Passenger).
2. Click **Create Application**.
3. Fill in the parameters:
   - **Node.js Version**: Select `18.x` or `20.x` (LTS).
   - **Application Mode**: `Production`
   - **Application Root**: `pakevfinder` (relative to home directory)
   - **Application URL**: `pakevfinder.com` (or your subdomain)
   - **Application Startup File**: `server.js` (Phusion Passenger will execute `.next/standalone/server.js`)
4. Click **Create**.

---

## 5. Environment Variables & Prisma Seeding on cPanel

1. In the Node.js Application Manager page, scroll to **Environment Variables**.
2. Add the following variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `mysql://youruser_evdbuser:YOUR_PASSWORD@127.0.0.1:3306/youruser_pakevfinder`
   - `PORT` = `3000`
3. Enter the cPanel SSH / Terminal or use the **Run NPM Install** button in cPanel UI.
4. To populate the database with authentic Pakistan EV market specs, run in cPanel terminal:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

---

## 6. Restarting the Application

1. Click **Restart Application** in cPanel Node.js App Manager.
2. Visit `https://pakevfinder.com` to verify live operation!
