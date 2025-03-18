import "./AccountDetail.scss";
import { useState } from "react";
import { AccountFieldType } from "../Enums/AccountFieldType";
import {
  AccountEditModel,
  AccountFieldValue,
} from "../Interfaces/AccountModels";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUser } from "../Server/Server";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button, ButtonGroup } from "@mui/material";
import { CustomTooltip } from "./Tooltip";
import ConfirmationDialog from "./ConfirmationDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

function AccountDetail(props: AccountDetailsProps) {
  const [user, setUser] = useRecoilState(userState);

  const [accountEditState, setAccountEditState] = useState<AccountEditModel>({
    isEditing: false,
    fieldType: props.accountFieldType,
  } as AccountEditModel);
  const [fieldValue, setFieldValue] = useState<AccountFieldValue>({
    userId: -1,
    value: "",
    type: props.accountFieldType,
  } as AccountFieldValue);

  function ResetAccountField() {
    setFieldValue({ ...fieldValue, userId: user.id, value: "" });
    setAccountEditState({
      isEditing: false,
      fieldType: null,
    });
  }

  async function UpdateAccountField() {
    const userData = await UpdateUser(fieldValue);
    setUser(userData);
    ResetAccountField();
  }

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogModel>({} as ConfirmationDialogModel);

  var cancelEditDetailDialog = {
    title: "Discard unsaved changes?",
    dialog: "This will delete all edits since you last saved",
    cancel_text: "Keep Editing",
    cancel_icon: <EditOutlinedIcon />,
    confirm_text: "Discard",
    confirm_icon: <DeleteIcon />,
    confirm_action: () => ResetAccountField(),
  } as ConfirmationDialogModel;

  var saveDetailDialog = {
    title: "Save changes?",
    dialog: "This will save your changes",
    cancel_text: "Keep Editing",
    cancel_icon: <EditOutlinedIcon />,
    confirm_text: "Save",
    confirm_icon: <SaveIcon />,
    confirm_action: () => UpdateAccountField(),
  } as ConfirmationDialogModel;

  return (
    <div className="info-item">
      <span className="info-label">{props.accountFieldName}</span>
      {accountEditState.isEditing ? (
        <form
          className="info-value"
          id={`${props.accountFieldName}-form`}
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmationDialog(saveDetailDialog);
            setIsDialogOpen(true);
          }}
        >
          <input
            className="input"
            type={props.inputType}
            placeholder={`Enter new ${props.accountFieldName}...`}
            autoComplete="off"
            value={fieldValue.value}
            onChange={(e) =>
              setFieldValue({
                ...fieldValue,
                userId: user.id,
                value: e.target.value,
              })
            }
            required
          />
        </form>
      ) : (
        <span className="info-value">{props.accountFieldValue}</span>
      )}
      <ButtonGroup className="info-action">
        {accountEditState.isEditing && (
          <Button
            onClick={() => {
              setConfirmationDialog(cancelEditDetailDialog);
              setIsDialogOpen(true);
            }}
          >
            <CustomTooltip title="Cancel" arrow>
              <CancelIcon />
            </CustomTooltip>
          </Button>
        )}
        {accountEditState.isEditing && (
          <Button
            form={`${props.accountFieldName}-form`}
            type="submit"
            disabled={fieldValue.value.length === 0}
          >
            <CustomTooltip title="Save" arrow>
              <SaveIcon />
            </CustomTooltip>
          </Button>
        )}
        {!accountEditState.isEditing && (
          <Button
            onClick={() =>
              setAccountEditState({
                ...accountEditState,
                isEditing: true,
              })
            }
          >
            <CustomTooltip title="Edit" arrow>
              <EditOutlinedIcon />
            </CustomTooltip>
          </Button>
        )}
      </ButtonGroup>
      <ConfirmationDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        data={confirmationDialog}
      />
    </div>
  );
}

export default AccountDetail;

interface AccountDetailsProps {
  accountFieldName: string;
  accountFieldType: AccountFieldType;
  accountFieldValue: string;
  inputType: string;
}
