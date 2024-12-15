export interface ConfirmationDialogModel {
  show: boolean;
  title: string;
  dialog: string;
  cancel_text: string;
  confirm_text: string;
  confirm_action: Function;
}
