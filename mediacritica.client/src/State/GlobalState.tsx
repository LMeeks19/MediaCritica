import { atom } from "recoil";
import { UserModel } from "../Interfaces/UserModel";

export const serviceApiKeyState = atom({
  key: "serviceApiKey",
  default: import.meta.env.VITE_SERVICE_API_KEY,
});

export const userState = atom({
  key: "userState",
  default: {} as UserModel,
});
