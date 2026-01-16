# API Connection Guide - Mission CMS

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error occurs when the partner redemption page tries to call the voucher API but receives an HTML error page instead of JSON.

## Root Cause

The **mission-cms** partner redemption page calls APIs from **bonus-galaxy-new**:
- `/api/vouchers/validate`
- `/api/vouchers/redeem`

These APIs only exist in the `bonus-galaxy-new` project, not in `mission-cms`.

## Solution: Run Both Projects

### For Local Development

You need to run **BOTH** projects simultaneously:

#### Terminal 1: bonus-galaxy-new (Port 3000)
```bash
cd bonus-galaxy-new
npm run dev
```
This should start on `http://localhost:3000`

#### Terminal 2: mission-cms (Port 3001 or different port)
```bash
cd mission-cms
npm run dev -- -p 3001
```
This will start on `http://localhost:3001`

### Access the Partner Redemption Page
Open: `http://localhost:3001/partner/redeem`

The page will automatically connect to `http://localhost:3000/api` for voucher operations.

## API Configuration

### Environment Variable
In `mission-cms/.env`:
```env
# For local development
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# For production
NEXT_PUBLIC_API_URL=https://bonus-galaxy-demo.vercel.app/api
```

### Automatic Detection
The code now automatically detects the environment:
- **Localhost**: Uses `http://localhost:3000/api`
- **Production**: Uses `https://bonus-galaxy-demo.vercel.app/api`

## Troubleshooting

### Error: "Connection failed"
**Cause:** bonus-galaxy-new is not running

**Solution:**
1. Open a new terminal
2. Navigate to bonus-galaxy-new: `cd bonus-galaxy-new`
3. Start the server: `npm run dev`
4. Verify it's running on port 3000

### Error: "API endpoint not found (404)"
**Cause:** The voucher API routes don't exist

**Solution:**
1. Check that these files exist in bonus-galaxy-new:
   - `app/api/vouchers/validate/route.ts`
   - `app/api/vouchers/redeem/route.ts`
2. Rebuild bonus-galaxy-new: `npm run build`
3. Restart the dev server

### Error: "CORS error"
**Cause:** Cross-origin request blocked

**Solution:**
Add CORS headers in bonus-galaxy-new API routes:
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Port Already in Use
If port 3000 is already taken:

**Option 1:** Stop the other process using port 3000

**Option 2:** Run bonus-galaxy-new on a different port:
```bash
cd bonus-galaxy-new
npm run dev -- -p 3002
```

Then update mission-cms/.env:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Debugging

### Check API Connection
The partner redemption page now shows the API URL at the top:
```
API: http://localhost:3000/api
```

### Browser Console
Open DevTools (F12) and check the Console tab for:
- `Validating voucher at: http://localhost:3000/api/vouchers/validate`
- `Response status: 200` (or error code)
- Any error messages

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to validate a voucher
4. Look for the `/vouchers/validate` request
5. Check the response (should be JSON, not HTML)

## Production Deployment

### Vercel Configuration

Both projects should be deployed separately:

**bonus-galaxy-new:**
- URL: `https://bonus-galaxy-demo.vercel.app`
- Has the voucher APIs

**mission-cms:**
- URL: `https://bonus-galaxy-cms.vercel.app`
- Environment variable: `NEXT_PUBLIC_API_URL=https://bonus-galaxy-demo.vercel.app/api`

### Environment Variables on Vercel

For **mission-cms** project on Vercel:
```env
NEXT_PUBLIC_API_URL=https://bonus-galaxy-demo.vercel.app/api
```

Make sure to set this for:
- ✅ Production
- ✅ Preview
- ✅ Development

## Quick Test

### Test if bonus-galaxy-new API is working:

```bash
# Test validate endpoint
curl -X POST http://localhost:3000/api/vouchers/validate \
  -H "Content-Type: application/json" \
  -d '{
    "method": "pin",
    "code": "1234",
    "employeeId": "emp_test",
    "partnerLocation": "Vienna Store"
  }'
```

Expected response (JSON):
```json
{
  "valid": false,
  "error": "Voucher not found"
}
```

If you get HTML instead, the API route doesn't exist.

## Architecture

```
┌─────────────────────┐
│   mission-cms       │
│   (Port 3001)       │
│                     │
│  Partner Redeem     │
│  Page               │
└──────────┬──────────┘
           │
           │ HTTP Requests
           │
           ▼
┌─────────────────────┐
│  bonus-galaxy-new   │
│  (Port 3000)        │
│                     │
│  /api/vouchers/     │
│    - validate       │
│    - redeem         │
└─────────────────────┘
```

## Summary

✅ **Fixed:** Better error handling for API calls
✅ **Fixed:** Automatic localhost detection
✅ **Added:** Console logging for debugging
✅ **Added:** API URL display on page

**Remember:** Always run both projects for local development!

---

**Last Updated:** January 16, 2026
