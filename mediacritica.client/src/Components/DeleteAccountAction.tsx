import { useRecoilState, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { DeleteUser } from "../Server/Server";
import { UserModel } from "../Interfaces/UserModel";
import Snackbar from "./Snackbar";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

function DeleteAccountAction() {
  const [user, setUser] = useRecoilState(userState);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

  async function DeleteAccount() {
    var deletedId = (await DeleteUser(user.id)) ?? false;
    if (deletedId) {
      setUser({} as UserModel);
      Snackbar.Success("Account deleted");
    } else Snackbar.Error("Failed to delete account");
  }

  const deleteAccountDialog = {
    show: true,
    title: "Delete Account",
    dialog: "This can't be undone",
    cancel_text: "Cancel",
    confirm_text: "Delete",
    confirm_action: null,
  } as unknown as ConfirmationDialogModel;

  return (
    <div className="info-item">
      <div className="info-label">Delete Account</div>
      <div className="info-value" />
      <div className="info-action">
        <button
          className="delete-btn"
          onClick={() =>
            setConfirmationDialog({
              ...deleteAccountDialog,
              confirm_action: () => DeleteAccount(),
            })
          }
        >
          Delete <DeleteIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}

export default DeleteAccountAction;
