import { checkSession, login as apiLogin, logout as apiLogout } from "./auth";

let currentUser = null;

export async function initAuthSession() {
  try {
    currentUser = await checkSession();
  } catch (err) {
    currentUser = null;
  }
  return currentUser;
}

export function getCurrentUser() {
  return currentUser;
}

export async function loginUser(username, password, mfaCode) {
  const data = await apiLogin(username, password, mfaCode);
  currentUser = data.user;
  return currentUser;
}

export async function logoutUser() {
  await apiLogout();
  currentUser = null;
}