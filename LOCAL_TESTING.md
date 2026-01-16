# Local Testing Guide - Partner Redemption

## Quick Start (No Vercel Deployment Needed)

Since the Vercel deployment requires authentication, you can test everything locally:

### Step 1: Run bonus-galaxy-new API (Terminal 1)

```bash
cd bonus-galaxy-new
npm run dev
```

This starts the API server on `http://localhost:3000`

### Step 2: Run mission-cms (Terminal 2)

```bash
cd mission-cms
npm run dev
```

This starts the admin portal on `http://localhost:3001`

### Step 3: Test Partner Redemption

1. Open `http://localhost:3001/partner/redeem`
2. Click "QR Code" tab
3. Click "Start Scanner"
4. Camera should activate ✅
5. Scan a voucher QR code (or switch to PIN tab)
6. Enter Employee ID: `emp_test_001`
7. Select Location: `Vienna Store`
8. Click "Validate"
9. Should work without CORS errors! ✅

## Configuration

The `.env` file in mission-cms is now set to use local API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## When to Use Production API

Switch back to production API when:
1. Vercel deployment is complete
2. Testing with real production data
3. Deploying mission-cms to production

To switch back:
```env
NEXT_PUBLIC_API_URL=https://bonus-galaxy-demo.vercel.app/api
```

## Troubleshooting

### "Connection refused" error
- Make sure bonus-galaxy-new is running on localhost:3000
- Check terminal 1 for any errors

### CORS errors
- Should NOT happen with local API (same machine)
- If you see CORS errors, check the API URL in `.env`

### "Voucher not found"
- Make sure you have vouchers in the database
- Run the seed script: `cd bonus-galaxy-new && npx tsx scripts/backfill-voucher-codes.ts`

## Testing Checklist

- [ ] Both servers running (3000 and 3001)
- [ ] QR scanner shows camera feed
- [ ] PIN validation works
- [ ] QR validation works
- [ ] Employee ID and location required
- [ ] Success message after redemption
- [ ] Error messages display correctly

---

**Status**: ✅ Ready for local testing
**No Vercel deployment needed for development**
