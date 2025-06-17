import { getCurrentUser, checkIsAdmin } from '../utils/firebase-auth';

/**
 * Navigation guard for Vue Router to protect admin routes
 * @param {Object} to - Route the user is navigating to
 * @param {Object} from - Route the user is navigating from
 * @param {Function} next - Function to resolve the navigation
 */
export const authGuard = async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (!requiresAuth) {
    // If the route doesn't require auth, proceed
    return next();
  }
  
  // Get the current user
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    // User is not authenticated, redirect to login
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
  
  // Check if the route requires admin privileges
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  
  if (requiresAdmin && !currentUser.isAdmin) {
    // User is not an admin, redirect to unauthorized page
    return next({ path: '/unauthorized' });
  }
  
  // User is authenticated and has the required privileges, proceed
  return next();
};