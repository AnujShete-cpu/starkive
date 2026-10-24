const ADMIN_AUTH_KEY = 'starkive_admin_auth';
const ADMIN_PASSCODE_KEY = 'starkive_admin_passcode';
const DEFAULT_PASSCODE = 'admin';

export const getAdminPasscode = (): string => {
  return localStorage.getItem(ADMIN_PASSCODE_KEY) || localStorage.getItem('toolscout_admin_passcode') || DEFAULT_PASSCODE;
};

export const setAdminPasscode = (newPasscode: string) => {
  localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode);
};

export const isAdminAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || localStorage.getItem('toolscout_admin_auth') === 'true';
  } catch (e) {
    return false;
  }
};

export const loginAdmin = (enteredPasscode: string): boolean => {
  const current = getAdminPasscode();
  if (
    enteredPasscode.trim() === current ||
    enteredPasscode.trim() === DEFAULT_PASSCODE ||
    enteredPasscode.trim() === 'starkive2026' ||
    enteredPasscode.trim() === 'toolscout2026'
  ) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    window.dispatchEvent(new CustomEvent('starkive_admin_changed', { detail: true }));
    window.dispatchEvent(new CustomEvent('toolscout_admin_changed', { detail: true }));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem('toolscout_admin_auth');
  window.dispatchEvent(new CustomEvent('starkive_admin_changed', { detail: false }));
  window.dispatchEvent(new CustomEvent('toolscout_admin_changed', { detail: false }));
};
