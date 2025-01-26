import { atom } from "recoil";
import { UserModel } from "../Interfaces/UserModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { NotificationModel } from "../Interfaces/NotificationModel";

export const userState = atom({
  key: "userState",
  default: {} as UserModel,
});

export const notificationsObjectState = atom({
  key: "notificationsObjectState",
  default: { totalCount: -1, notifications: [] } as {
    totalCount: number;
    notifications: NotificationModel[];
  },
});

export const ConfirmationDialogState = atom({
  key: "ConfirmationDialogState",
  default: {} as ConfirmationDialogModel,
});
