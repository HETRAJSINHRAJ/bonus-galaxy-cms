import { clerkClient } from '@clerk/nextjs/server';

/**
 * Script to set user role in Clerk
 * Usage: npx tsx scripts/set-user-role.ts <email> <role>
 * Example: npx tsx scripts/set-user-role.ts admin@example.com super_admin
 */

async function setUserRole() {
  const email = process.argv[2];
  const role = process.argv[3];

  if (!email || !role) {
    console.error('Usage: npx tsx scripts/set-user-role.ts <email> <role>');
    console.error('Roles: viewer, editor, admin, super_admin');
    process.exit(1);
  }

  const validRoles = ['viewer', 'editor', 'admin', 'super_admin'];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role: ${role}`);
    console.error(`Valid roles: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  try {
    const client = await clerkClient();
    
    // Find user by email
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      console.error(`User not found with email: ${email}`);
      process.exit(1);
    }

    const user = users.data[0];
    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id})`);

    // Update user's public metadata with role
    await client.users.updateUser(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        role: role,
      },
    });

    console.log(`✅ Successfully set role to: ${role}`);
    console.log(`User can now access the Mission CMS dashboard`);
  } catch (error) {
    console.error('Error setting user role:', error);
    process.exit(1);
  }
}

setUserRole();
