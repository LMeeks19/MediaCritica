import { atom } from "recoil";
import { UserModel } from "../Interfaces/UserModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";

export const userState = atom({
  key: "userState",
  default: {} as UserModel,
});

export const ConfirmationDialogState = atom({
  key: "ConfirmationDialogState",
  default: {} as ConfirmationDialogModel,
});
