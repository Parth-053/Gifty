import { ROLES } from './constants';

const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'view_dashboard', 'manage_users', 'manage_sellers', 'manage_products', 
    'manage_categories', 'manage_orders', 'manage_settings', 'view_analytics'
  ],
  [ROLES.MANAGER]: [
    'view_dashboard', 'manage_products', 'manage_categories', 'manage_orders', 'view_analytics'
  ],
  [ROLES.SUPPORT]: [
    'view_dashboard', 'view_orders', 'view_users', 'view_sellers'
  ],
  [ROLES.EDITOR]: [
    'view_dashboard', 'manage_products', 'manage_categories'
  ]
};

/**
 * Check if a role has specific permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const userPermissions = PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if role is allowed to access a specific route path
 */
export const canAccessRoute = (userRole, path) => {
  // Define restricted routes
  const restrictedRoutes = {
    '/settings': [ROLES.SUPER_ADMIN],
    '/payments': [ROLES.SUPER_ADMIN, ROLES.MANAGER],
    '/users': [ROLES.SUPER_ADMIN, ROLES.SUPPORT],
  };

  // Find if current path starts with any restricted key
  const matchedRestriction = Object.keys(restrictedRoutes).find(r => path.startsWith(r));

  if (!matchedRestriction) return true; // Not restricted
  
  return restrictedRoutes[matchedRestriction].includes(userRole);
};