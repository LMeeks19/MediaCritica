import { SetterOrUpdater } from "recoil";
import { AuthToken } from "../Interfaces/AuthToken";
import { UserModel } from "../Interfaces/UserModel";
import { Logout } from "../Server/Server";
import { resetThemePalette } from "./ThemePaletteHelper";
import { NotificationModel } from "../Interfaces/NotificationModel";

export function storeAuthToken(authToken: AuthToken) {
  document.cookie = `authToken=${authToken.token};expires=${new Date(
    authToken.expiration
  ).toUTCString()};path=/;Secure;SameSite=Strict`;
}

export function deleteAuthToken() {
  document.cookie =
    "authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;Secure;SameSite=Strict";
}

export function getAuthToken() {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/);
  return match ? match[2] : null;
}

export function areCookiesEnabled() {
  return navigator.cookieEnabled;
}

export async function LogoutUser(
  setNotificationsObject: SetterOrUpdater<NotificationModel[]>,
  setUser: SetterOrUpdater<UserModel>
) {
  var token = getAuthToken();

  if (token != null) {
    await Logout(token);
    deleteAuthToken();
  }

  setNotificationsObject([]);
  setUser({} as UserModel);
  resetThemePalette();
}
