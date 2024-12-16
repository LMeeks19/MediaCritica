import { Divider } from "@mui/material";
import { useRecoilState } from "recoil";
import { ConfirmationDialogState } from "../State/GlobalState";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import "./ConfirmationDialog.scss";

function ConfirmationDialog() {
  const [confirmationDialog, setConfirmationDialog] = useRecoilState(
    ConfirmationDialogState
  );

  const blankDialog = {
    show: false,
    title: "",
    dialog: "",
    cancel_text: "",
    confirm_text: "",
    confirm_action: null,
  } as unknown as ConfirmationDialogModel;

  return (
    <div hidden={confirmationDialog.show ? false : true}>
      <div className="background"></div>
      <div className="modal">
        <div className="header">
          <div className="title">{confirmationDialog.title}?</div>
        </div>
        <div className="dialog">{confirmationDialog.dialog}</div>
        <Divider className="divider" />
        <div className="buttons">
          <button
            className="cancel-btn"
            onClick={() => setConfirmationDialog(blankDialog)}
          >
            {confirmationDialog.cancel_text}
          </button>
          <button
            className="confirm-btn"
            onClick={() => {
              confirmationDialog.confirm_action();
              setConfirmationDialog(blankDialog);
            }}
          >
            {confirmationDialog.confirm_text}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
