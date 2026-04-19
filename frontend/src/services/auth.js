export function getCurrentUser() {
  // Check sessionStorage first (preferred, more secure)
  let user = sessionStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  
  // Fallback to localStorage for legacy support (should migrate away from this)
  user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  
  return null;
}