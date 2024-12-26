import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { DeleteUser } from "../Server/Server";
import { UserModel } from "../Interfaces/UserModel";
import { Snackbar } from "./Snackbar";

function DeleteAccountAction() {
  const [user, setUser] = useRecoilState(userState);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

  async function DeleteAccount() {
    var deletedId = await DeleteUser(user.id) ?? false;
    if (deletedId) {
      setUser({} as UserModel);
      Snackbar("Account deleted", "success");
    } else Snackbar("Failed to delete account", "error");
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
          Delete <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default DeleteAccountAction;
