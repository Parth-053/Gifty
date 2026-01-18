export const ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  [ROLES.USER]: ["read:products", "create:orders", "read:own_orders"],
  [ROLES.SELLER]: ["read:products", "create:products", "update:own_products", "read:own_sales"],
  [ROLES.ADMIN]: ["manage:all"],
};