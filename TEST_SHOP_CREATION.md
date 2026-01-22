# Shop Creation Testing Guide

## Setup Complete! ✅

The shop creation system has been successfully implemented. Here's what was done:

### 1. Created Shop Creation Dialog
- **File**: `mission-cms/components/shops/create-shop-dialog.tsx`
- A beautiful dialog component with form fields for:
  - Shop Name (required)
  - Description
  - Address
  - Email
  - Phone
  - Website
  - Logo URL

### 2. Updated Shops Page
- **File**: `mission-cms/app/shops/page.tsx`
- Integrated the CreateShopDialog component
- Added "Create Shop" button in header
- Added "Create Your First Shop" button in empty state

### 3. API Integration
The system uses the existing API endpoints in bonus-galaxy-new:
- **GET** `/api/shops` - List all shops
- **POST** `/api/shops` - Create new shop
- **GET** `/api/shops/:id` - Get shop details
- **PUT** `/api/shops/:id` - Update shop
- **DELETE** `/api/shops/:id` - Delete shop

### 4. Database Schema
The Shop model in bonus-galaxy-new includes:
```prisma
model Shop {
  id              String   @id @default(cuid())
  name            String
  description     String?
  address         String?
  latitude        Float?
  longitude       Float?
  logo            String?
  email           String?
  phone           String?
  website         String?
  nequadaBalance  Int      @default(0)
  totalVouchersSold     Int @default(0)
  totalVouchersRedeemed Int @default(0)
  employees       Employee[]
  voucherOffers   VoucherOffer[]
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## How to Test

### Step 1: Start Both Applications

**Terminal 1 - Start bonus-galaxy-new (API server):**
```bash
cd bonus-galaxy-new
npm run dev
```
This should start on `http://localhost:3000`

**Terminal 2 - Start mission-cms:**
```bash
cd mission-cms
npm run dev
```
This should start on `http://localhost:3001` (or another port)

### Step 2: Verify Environment Variables

Make sure `mission-cms/.env` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 3: Create a Shop

1. Open mission-cms in your browser (usually `http://localhost:3001`)
2. Navigate to the Shops page
3. Click "Create Shop" button
4. Fill in the form:
   - **Name**: Test Café (required)
   - **Description**: A cozy café in Vienna
   - **Address**: Mariahilfer Straße 1, 1060 Vienna
   - **Email**: test@cafe.com
   - **Phone**: +43 1 234567
   - **Website**: https://testcafe.com
   - **Logo**: https://via.placeholder.com/150
5. Click "Create Shop"

### Step 4: Verify Shop Creation

After creating a shop, you should:
1. See the new shop appear in the shops list
2. Be able to click on it to view details
3. See it in the marketplace on bonus-galaxy-new

### Step 5: View Shop in Marketplace

1. Open bonus-galaxy-new in your browser (`http://localhost:3000`)
2. Navigate to `/marketplace`
3. The marketplace will show voucher offers from shops (once offers are created)

## Troubleshooting

### Issue: "Failed to fetch shops"
**Solution**: Make sure bonus-galaxy-new is running on port 3000

### Issue: "Failed to create shop"
**Solutions**:
1. Check that DATABASE_URL is set correctly in both apps
2. Run database migrations:
   ```bash
   cd bonus-galaxy-new
   npx prisma migrate dev
   npx prisma generate
   ```

### Issue: CORS errors
**Solution**: The proxy.ts in bonus-galaxy-new already allows mission-cms access to the shops API

### Issue: Authentication errors
**Solution**: Make sure you're signed in to mission-cms with a valid Clerk account

## Next Steps

After creating shops, you can:

1. **Add Employees** to shops (via `/shops/:id` page)
2. **Create Voucher Offers** for each shop
3. **View Analytics** for shop performance
4. **Manage Redemptions** through the employee interface

## Real Data Flow

```
mission-cms (Port 3001)
    ↓
    Creates Shop via POST /api/shops
    ↓
bonus-galaxy-new API (Port 3000)
    ↓
    Saves to PostgreSQL Database
    ↓
    Returns shop data
    ↓
mission-cms displays shop
    ↓
bonus-galaxy-new marketplace shows shop offers
```

## Database Connection

Both apps share the same PostgreSQL database:
```
postgresql://neondb_owner:npg_PegMZUqty52p@ep-still-surf-a1o1cvsz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

This ensures data consistency across both applications.
