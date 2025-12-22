/**
 * Shared types for mission CMS
 * Safe to import from both client and server components
 */

/**
 * Role hierarchy for mission CMS
 */
export enum Role {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Permission levels mapped to roles
 */
export const ROLE_PERMISSIONS = {
  [Role.VIEWER]: ['view_missions', 'view_analytics'],
  [Role.EDITOR]: ['view_missions', 'view_analytics', 'create_missions', 'edit_missions', 'edit_own_missions'],
  [Role.ADMIN]: ['view_missions', 'view_analytics', 'create_missions', 'edit_missions', 'delete_missions', 'publish_missions', 'manage_users'],
  [Role.SUPER_ADMIN]: ['*'], // All permissions
};
