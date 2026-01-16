# Vercel Deployment Guide for mission-cms

## Issue: Sign-in works locally but not on Vercel

This happens when environment variables are not properly configured in Vercel.

## Required Environment Variables

Go to your Vercel dashboard:
1. https://vercel.com/dashboard
2. Select `bonus-galaxy-cms` project
3. Go to **Settings** → **Environment Variables**

### Add these variables:

```env
# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmxleGlibGUtc2VhZ3VsbC0yMi5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_U06ZUv2WbwfGUITy1J6VlpjXYAFo5teProjH9mlrP0

# Database (REQUIRED)
DATABASE_URL=postgresql://neondb_owner:npg_PegMZUqty52p@ep-still-surf-a1o1cvsz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# API Configuration (REQUIRED)
NEXT_PUBLIC_API_URL=https://bonus-galaxy-demo.vercel.app/api

# Environment
ENVIRONMENT=production
```

## Important Notes:

### 1. Clerk Domain Configuration
You need to add your Vercel domain to Clerk:

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Domains** (or **Settings** → **Domains**)
4. Add these domains:
   - `bonus-galaxy-cms.vercel.app`
   - `https://bonus-galaxy-cms.vercel.app`
5. Save changes

### 2. Clerk Redirect URLs
Add these redirect URLs in Clerk:

1. Go to **Paths** (or **Settings** → **Paths**)
2. Add:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up` (if needed)
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

### 3. Environment Variable Scope
Make sure to set variables for:
- ✅ Production
- ✅ Preview
- ✅ Development

## After Adding Variables:

1. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**
   - Check "Use existing Build Cache" (optional)
   - Click **Redeploy**

2. **Wait** for deployment to complete (~2 minutes)

3. **Test** sign-in at `https://bonus-galaxy-cms.vercel.app/sign-in`

## Troubleshooting:

### Error: "This email is not authorized"
- The `/api/verify-email` endpoint is working
- But the user doesn't have a role in Clerk
- **Solution**: Go to `https://bonus-galaxy-cms.vercel.app/setup-admin` and grant yourself admin access

### Error: "Clerk: Missing publishable key"
- Environment variables not set in Vercel
- **Solution**: Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Vercel settings

### Error: "Failed to verify email"
- `CLERK_SECRET_KEY` not set or incorrect
- **Solution**: Add correct `CLERK_SECRET_KEY` in Vercel settings

### Error: Network/CORS errors
- API URL not configured
- **Solution**: Add `NEXT_PUBLIC_API_URL=https://bonus-galaxy-demo.vercel.app/api`

## Quick Test:

After deployment, test these URLs:

1. **Sign-in page**: https://bonus-galaxy-cms.vercel.app/sign-in
2. **Setup admin**: https://bonus-galaxy-cms.vercel.app/setup-admin
3. **Partner redeem**: https://bonus-galaxy-cms.vercel.app/partner/redeem

## Alternative: Use Setup Admin Page

If sign-in still doesn't work:

1. Go to: https://bonus-galaxy-cms.vercel.app/setup-admin
2. This uses Clerk's standard sign-in (no custom email verification)
3. After signing in, click "Grant Super Admin Access"
4. You'll be redirected to dashboard

---

**Last Updated**: January 16, 2026
