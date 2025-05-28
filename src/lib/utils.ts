export function isPasswordSecure(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false; 
  if (!/[a-z]/.test(password)) return false; 
  if (!/[0-9]/.test(password)) return false; 

  if (!/[^A-Za-z0-9\s]/.test(password)) return false; 
  return true;
}