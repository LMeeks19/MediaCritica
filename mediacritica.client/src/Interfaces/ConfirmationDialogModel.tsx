import { ReactElement } from "react";

export interface ConfirmationDialogModel {
  title: string;
  dialog: string;
  cancel_text: string;
  cancel_icon: ReactElement;
  confirm_text: string;
  confirm_icon: ReactElement;
  confirm_action: Function;
}
