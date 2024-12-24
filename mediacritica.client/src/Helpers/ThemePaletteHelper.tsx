import { PreferenceModel } from "../Interfaces/UserModel";
import $ from "jquery";

export function setThemePalette(preference: PreferenceModel) {
  $(":root").css("--palette-colour", preference.palette);
  $(":root").css("color-scheme", getTheme(preference.theme));
}

export function resetThemePalette() {
  $(":root").css("color-scheme", "light dark");
  $(":root").css("--palette-colour", "var(--primary-red)");
}

function getTheme(theme: string = "System") {
  if (theme === "System") return "light dark";
  return theme.toLowerCase();
}
