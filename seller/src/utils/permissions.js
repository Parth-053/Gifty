export const ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  SUPPORT: 'support'
};

const PERMISSIONS = {
  [ROLES.SELLER]: [
    'view_dashboard',
    'manage_products',
    'manage_orders',
    'view_analytics',
    'manage_profile'
  ],
  [ROLES.SUPPORT]: [
    'view_dashboard',
    'view_orders',
    'manage_support_tickets'
  ],
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_platform'
  ]
};

/**
 * Checks if a user has permission to perform an action
 */
export const hasPermission = (userRole, action) => {
  if (!userRole) return false;
  
  // Admin has access to everything (optional logic)
  if (userRole === ROLES.ADMIN) return true;

  const userPermissions = PERMISSIONS[userRole] || [];
  return userPermissions.includes(action);
};

/**
 * Checks if user is allowed to access a route
 */
export const canAccessRoute = (userRole, routePath) => {
  // Define restricted routes here
  const restrictedRoutes = {
    '/settings/billing': [ROLES.SELLER, ROLES.ADMIN], // Support cannot access billing
    '/products/add': [ROLES.SELLER],
  };

  const allowedRoles = restrictedRoutes[routePath];
  
  // If route is not restricted, allow access
  if (!allowedRoles) return true;

  return allowedRoles.includes(userRole);
};