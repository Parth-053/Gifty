export const getStoredToken = () => localStorage.getItem('sellerToken');
export const setStoredToken = (token) => localStorage.setItem('sellerToken', token);
export const removeStoredToken = () => localStorage.removeItem('sellerToken');

export const clearAllStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
};