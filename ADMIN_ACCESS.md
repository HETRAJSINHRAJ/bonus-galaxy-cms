# Admin Access Management

## How to Add New Admin Users

This CMS follows enterprise security best practices used by companies like Shopify, Stripe, and Vercel - **invitation-only access** with no public sign-up.

### Adding New Admins

**Option 1: Direct Creation in Clerk Dashboard (Recommended)**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Users** section
3. Click **Create User**
4. Fill in user details (email, name)
5. After creation, select the user
6. Go to **Metadata** tab
7. Add to **Public Metadata**:
```json
{
  "role": "viewer"
}
```

**Option 2: Email Invitation (Enterprise Plan)**
1. In Clerk Dashboard, go to **Invitations**
2. Send invitation email
3. Once they accept, set their role in metadata

### Available Roles

Set in user's Public Metadata:

```json
{
  "role": "viewer"        // Read-only access to missions and analytics
}
```

```json
{
  "role": "editor"        // Can create and edit own missions
}
```

```json
{
  "role": "admin"         // Full mission management + user management
}
```

```json
{
  "role": "super_admin"   // All permissions including system settings
}
```

### Security Features

✅ **No Public Sign-Up** - Only pre-approved users can access the CMS
✅ **Role-Based Access Control** - Granular permissions per user
✅ **Middleware Protection** - All routes protected except sign-in
✅ **Audit Trail** - Track who created/edited each mission (via `createdBy` field)

### How Enterprise Companies Handle Admin Access

**Shopify Admin:**
- Team member invitations only
- Role-based permissions (Staff, Admin, Owner)
- No public sign-up

**Stripe Dashboard:**
- Invitation-based team management
- Fine-grained permissions
- SSO for enterprise customers

**Vercel Dashboard:**
- Team invitations
- Role assignments (Viewer, Developer, Owner)
- GitHub/GitLab SSO

**WordPress Admin:**
- Admin creates user accounts
- 5 role levels (Subscriber to Administrator)
- No self-registration for admin area

### Best Practices

1. **Start with minimal permissions** - Assign "viewer" role first, upgrade as needed
2. **Audit regularly** - Review who has access in Clerk Dashboard
3. **Use SSO for enterprises** - Consider GitHub/Google OAuth for your team
4. **Track changes** - Mission CMS automatically logs `createdBy` and `lastEditedBy`
5. **Remove inactive users** - Delete or disable users who no longer need access

### For Your Team

To give your team access to Mission CMS:

1. Create their Clerk account in the dashboard
2. Set initial role to `viewer`
3. Share the CMS URL: http://localhost:3001 (or production URL)
4. They sign in with their email/password
5. Upgrade their role as needed based on responsibilities
