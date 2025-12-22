# Mission CMS

A comprehensive admin system for creating, managing, and tracking gamified missions with role-based access control, real-time synchronization, analytics dashboards, and scheduling features.

**Security:** Invitation-only access with no public sign-up. Only pre-approved admin accounts can access the CMS.

## Features

- **Role-Based Access Control (RBAC)**: Four-tier permission system (Viewer, Editor, Admin, Super Admin)
- **Mission Management**: Complete CRUD operations with validation
- **Analytics Dashboard**: Real-time metrics and performance tracking
- **Bulk Operations**: Manage multiple missions simultaneously
- **Scheduling System**: Automated mission lifecycle management
- **API Integration**: RESTful APIs for web and mobile apps

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **UI**: shadcn/ui + Tailwind CSS
- **Validation**: Zod
- **Charts**: Recharts

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the CMS.

## Project Structure

```
mission-cms/
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   ├── admin/        # Admin dashboard pages
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   └── ...           # Custom components
├── lib/              # Utility functions
│   ├── auth.ts       # RBAC middleware
│   ├── prisma.ts     # Prisma client
│   └── ...
├── prisma/           # Database schema & migrations
└── public/           # Static assets
```

## User Roles

- **Viewer**: View missions and analytics (read-only)
- **Editor**: Create and edit own missions
- **Admin**: Full mission management + user management
- **Super Admin**: All permissions + system settings

## API Endpoints

### Admin APIs
- `GET /api/admin/missions` - List all missions
- `POST /api/admin/missions` - Create mission
- `PATCH /api/admin/missions/[id]` - Update mission
- `DELETE /api/admin/missions/[id]` - Delete mission
- `POST /api/admin/missions/bulk` - Bulk operations
- `GET /api/admin/missions/analytics` - Analytics data

### User-Facing APIs
- `GET /api/missions` - Get active missions
- `GET /api/missions/[id]` - Get mission details
- `POST /api/missions/[id]/start` - Start a mission
- `POST /api/missions/[id]/complete` - Complete mission

### Mobile APIs
- `GET /api/mobile/missions` - Get missions for mobile
- `GET /api/mobile/missions/[id]` - Get mission details

## License

Private - Bonus Galaxy Project
