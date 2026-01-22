# Vercel Environment Variable Update

## Required Environment Variable

To make the voucher bundle management work in production, you need to add the following environment variable to your Vercel deployment:

### For mission-cms (bonus-galaxy-cms.vercel.app)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **mission-cms** project (bonus-galaxy-cms)
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

   **Name:** `NEXT_PUBLIC_API_URL`
   
   **Value:** `https://bonus-galaxy-demo.vercel.app/api`
   
   **Environment:** Production (and optionally Preview/Development)

5. Click **Save**
6. **Redeploy** your application:
   - Go to the **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Select **Redeploy**

## Verification

After redeployment, visit:
- https://bonus-galaxy-cms.vercel.app/shops

The voucher bundles should now load from the production API at `bonus-galaxy-demo.vercel.app`

## Local Development

For local development, the `.env.local` file is configured to use `http://localhost:3000/api`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Make sure both apps are running:
```bash
# Terminal 1 - bonus-galaxy-new
cd bonus-galaxy-new && npm run dev

# Terminal 2 - mission-cms  
cd mission-cms && npm run dev
```

## Troubleshooting

If you still see connection errors:

1. **Check the API URL is set correctly** in Vercel environment variables
2. **Verify bonus-galaxy-new is deployed** and accessible at https://bonus-galaxy-demo.vercel.app
3. **Check CORS configuration** in bonus-galaxy-new/proxy.ts allows requests from bonus-galaxy-cms.vercel.app
4. **Check the browser console** for any CORS or network errors
5. **Redeploy** after making environment variable changes
