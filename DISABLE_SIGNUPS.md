# Disable Sign-Ups in Clerk Dashboard

To completely prevent unauthorized users from creating accounts:

## Step 1: Disable Sign-Ups in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **User & Authentication** → **Email, Phone, Username**
4. Scroll down to **Sign-up options**
5. **Disable** the toggle for "Allow sign-ups"

This will prevent anyone from creating new accounts through the sign-in page.

## Step 2: Configure Session Settings (Optional)

1. In Clerk Dashboard, go to **Sessions**
2. Set appropriate session timeout
3. Enable **Multi-session handling** if needed

## Step 3: Test

After disabling sign-ups in Clerk Dashboard:
- Try accessing `/sign-in` with an unapproved email
- You should see an error: "Couldn't find your account"
- Only existing users will be able to sign in

## Current Configuration

The CMS is configured to:
- ✅ No `/sign-up` routes
- ✅ SignIn component with `signUpUrl={undefined}`
- ✅ Middleware blocks unauthenticated access
- ⚠️ **You must disable sign-ups in Clerk Dashboard**

Without disabling sign-ups in Clerk Dashboard, users can still create accounts through Clerk's default behavior.
