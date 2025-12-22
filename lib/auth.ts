import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Role, ROLE_PERMISSIONS } from './types';

// Re-export for convenience
export { Role } from './types';

/**
 * Get user role from Clerk public metadata
 */
export async function getUserRole(): Promise<Role | null> {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  const role = user.publicMetadata?.role as Role;
  
  // Default to viewer if no role is set
  return role || null;
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const role = await getUserRole();
  
  if (!role) {
    return false;
  }

  const permissions = ROLE_PERMISSIONS[role];
  
  // Super admin has all permissions
  if (permissions.includes('*')) {
    return true;
  }

  return permissions.includes(permission);
}

/**
 * Check if user has minimum required role
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const userRole = await getUserRole();
  
  if (!userRole) {
    return false;
  }

  const roleHierarchy = [Role.VIEWER, Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN];
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return { userId };
}

/**
 * Middleware to check if user has required role
 */
export async function requireRole(requiredRole: Role) {
  const authResult = await requireAuth();
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const hasRequiredRole = await hasRole(requiredRole);
  
  if (!hasRequiredRole) {
    return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
  }

  return authResult;
}

/**
 * Middleware to check if user has specific permission
 */
export async function requirePermission(permission: string) {
  const authResult = await requireAuth();
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const hasRequiredPermission = await hasPermission(permission);
  
  if (!hasRequiredPermission) {
    return NextResponse.json({ error: 'Forbidden - Missing permission: ' + permission }, { status: 403 });
  }

  return authResult;
}

/**
 * Check if user can edit a specific mission (creator or admin+)
 */
export async function canEditMission(missionCreatorId: string): Promise<boolean> {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }

  // Creator can always edit their own mission
  if (userId === missionCreatorId) {
    return true;
  }

  // Admin or higher can edit any mission
  return await hasRole(Role.ADMIN);
}

/**
 * Get current user ID or throw error
 */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
}
