import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { DeleteUser } from "../Server/Server";
import { UserModel } from "../Interfaces/UserModel";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import { Button, ButtonGroup } from "@mui/material";
import { CustomTooltip } from "./Tooltip";
import ConfirmationDialog from "./ConfirmationDialog";
import { useState } from "react";

function DeleteAccountAction() {
  const [user, setUser] = useRecoilState(userState);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const deleteAccountDialog = {
    title: "Delete Account?",
    dialog: "This cannot be undone!",
    cancel_text: "Cancel",
    cancel_icon: <CancelIcon />,
    confirm_text: "Delete",
    confirm_icon: <DeleteIcon />,
    confirm_action: () => DeleteAccount(),
  } as ConfirmationDialogModel;

  async function DeleteAccount() {
    await DeleteUser(user.id);
    setUser({} as UserModel);
  }

  return (
    <div className="info-item">
      <div className="info-label">Delete Account</div>
      <div className="info-value" />
      <ButtonGroup className="info-action">
        <Button onClick={() => setIsDialogOpen(true)}>
          <CustomTooltip title="Delete Account">
            <DeleteIcon fontSize="small" />
          </CustomTooltip>
        </Button>
      </ButtonGroup>
      <ConfirmationDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        data={deleteAccountDialog}
      />
    </div>
  );
}

export default DeleteAccountAction;
