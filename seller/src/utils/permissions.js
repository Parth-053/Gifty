export const ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
};

// Seller Profile Status check
export const isAccountApproved = (user) => {
    return user?.role === ROLES.SELLER && user?.status === 'approved';
};

export const canAccessModule = (user, module) => {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    
    // Only approved sellers can manage products/orders
    if (user.role === ROLES.SELLER && user.status === 'approved') {
        const allowed = ['inventory', 'orders', 'finance', 'profile'];
        return allowed.includes(module);
    }
    return false;
};