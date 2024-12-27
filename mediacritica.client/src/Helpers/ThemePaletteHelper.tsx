import { PreferenceModel } from "../Interfaces/UserModel";
import $ from "jquery";

export function setThemePalette(preference: PreferenceModel) {
  $(":root").css("--palette-colour", preference?.palette);
  $(":root").css("--palette-colour-faded", `${preference?.palette}40`);

  $(":root").css("color-scheme", getTheme(preference?.theme));
}

export function resetThemePalette() {
  $(":root").css("color-scheme", "light dark");
  $(":root").css("--palette-colour", "#971212");
  $(":root").css("--palette-colour-faded", "#97121280");

}

function getTheme(theme: string = "System") {
  if (theme === "System") return "light dark";
  return theme.toLowerCase();
}
