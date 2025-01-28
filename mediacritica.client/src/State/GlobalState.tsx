import { atom } from "recoil";
import { UserModel } from "../Interfaces/UserModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { NotificationModel } from "../Interfaces/NotificationModel";

export const userState = atom({
  key: "userState",
  default: {} as UserModel,
});

export const notificationsState = atom({
  key: "notificationsState",
  default: [] as NotificationModel[]
});

export const ConfirmationDialogState = atom({
  key: "ConfirmationDialogState",
  default: {} as ConfirmationDialogModel,
});
