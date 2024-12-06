import { atom } from "recoil";
import { UserModel } from "../Interfaces/UserModel";

export const userState = atom({
  key: "userState",
  default: {} as UserModel,
});
