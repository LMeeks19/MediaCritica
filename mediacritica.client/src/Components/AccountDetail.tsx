import "./AccountDetail.scss";
import { useState } from "react";
import { AccountFieldType } from "../Enums/AccountFieldType";
import {
  AccountEditModel,
  AccountFieldValue,
} from "../Interfaces/AccountModels";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { UpdateUser } from "../Server/Server";
import Snackbar  from "./Snackbar";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import CancelIcon from '@mui/icons-material/CancelOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

function AccountDetail(props: AccountDetailsProps) {
  const [user, setUser] = useRecoilState(userState);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

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
    Snackbar.Info("Account Updated");
    ResetAccountField();
  }

  const cancelEditDetailDialog = {
    show: true,
    title: "Discard unsaved changes",
    dialog: "This will delete all edits since you last saved",
    cancel_text: "Keep Editing",
    confirm_text: "Discard",
    confirm_action: () => ResetAccountField(),
  } as unknown as ConfirmationDialogModel;

  const saveDetailDialog = {
    show: true,
    title: "Save changes",
    dialog: "This will save your changes",
    cancel_text: "Keep Editing",
    confirm_text: "Save",
    confirm_action: null,
  } as unknown as ConfirmationDialogModel;

  return (
    <div className="info-item">
      <span className="info-label">{props.accountFieldName}</span>
      {accountEditState.isEditing ? (
        <form
          className="info-value"
          id={`${props.accountFieldName}-form`}
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmationDialog({
              ...saveDetailDialog,
              confirm_action: () => UpdateAccountField(),
            });
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
      <div className="info-action">
        {accountEditState.isEditing && (
          <button
            disabled={!accountEditState.isEditing}
            className="cancel-btn"
            onClick={() => setConfirmationDialog(cancelEditDetailDialog)}
          >
            Cancel <CancelIcon fontSize="small" />
          </button>
        )}
        {accountEditState.isEditing && (
          <button className="save-btn" form={`${props.accountFieldName}-form`}>
            Save <SaveIcon fontSize="small" />
          </button>
        )}
        {!accountEditState.isEditing && (
          <button
            className="edit-btn"
            disabled={accountEditState.isEditing}
            onClick={() =>
              setAccountEditState({
                ...accountEditState,
                isEditing: true,
              })
            }
          >
            Edit <EditOutlinedIcon fontSize="small" />
          </button>
        )}
      </div>
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
