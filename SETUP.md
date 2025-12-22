# Mission CMS Setup Guide

## Initial Setup

1. **Install Dependencies**
```bash
cd mission-cms
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Clerk API keys
- App URL

**Note:** This CMS uses the shared Prisma client from `bonus-galaxy-new`, so make sure that project's database is set up first.

3. **Database Setup** (if not already done in bonus-galaxy-new)
```bash
cd ../bonus-galaxy-new
npx prisma migrate dev
npx prisma generate
cd ../mission-cms
```

4. **Run Development Server**
```bash
npm run dev
```

The CMS will be available at http://localhost:3001

## Setting Up Admin Users

**Important:** This CMS has no sign-up page. Access is invitation-only.

### Adding Admin Users

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Users** → **Create User**
3. Enter user details (email, name, password)
4. After creation, select the user
5. Go to **Metadata** tab
6. Add to **Public Metadata**:
```json
{
  "role": "super_admin"
}
```

Available roles:
- `viewer` - Read-only access
- `editor` - Create and edit own missions
- `admin` - Full mission management
- `super_admin` - All permissions

## Project Structure

```
mission-cms/
├── app/
│   ├── api/admin/missions/     # Admin API endpoints
│   ├── dashboard/              # Admin UI pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                 # RBAC middleware
│   ├── prisma.ts               # Shared Prisma client (from bonus-galaxy-new)
│   ├── utils.ts                # Helper functions
│   └── validation.ts           # Zod schemas
├── .env                        # Environment variables
└── package.json
```

**Note:** Database schema is managed in `bonus-galaxy-new/prisma/schema.prisma`

## API Integration

The CMS provides APIs that your main Bonus Galaxy apps can consume:

### For Web App (bonus-galaxy-new)
```typescript
// Fetch active missions
const response = await fetch('http://localhost:3001/api/missions');
const { missions } = await response.json();
```

### For Mobile App (bonus-galaxy-mobile)
```typescript
// Fetch missions for mobile
const response = await fetch('http://localhost:3001/api/mobile/missions');
const { missions, stats } = await response.json();
```

## Database Schema

The CMS uses 3 main models (defined in `bonus-galaxy-new/prisma/schema.prisma`):

1. **Mission** - Mission definitions with requirements, rewards, scheduling
2. **UserMissionProgress** - Tracks user progress and completions
3. **MissionAnalytics** - Daily analytics and metrics

These tables share the same database as bonus-galaxy-new.

## Next Steps

1. Complete the admin dashboard pages (missions list, edit, analytics)
2. Add Vercel Cron for automated mission scheduling
3. Implement real-time updates (optional)
4. Deploy to Vercel

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

**Important:** When deploying, ensure the CMS can access the shared Prisma client. You may need to adjust the import path or include Prisma as a dependency.
