import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUserPreference } from "../Server/Server";
import { PreferenceModel } from "../Interfaces/UserModel";
import { Select, Button, ButtonGroup } from "@mui/material";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CustomTooltip } from "./Tooltip";
import { setThemePalette } from "../Helpers/ThemePaletteHelper";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import ConfirmationDialog from "./ConfirmationDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

function TimezonePreference() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userState);

  const [timezone, setTimezone] = useState<string>(user.preference?.timezone);

  async function ChangePreference() {
    const preference = await UpdateUserPreference({
      id: user.preference.id,
      theme: user.preference?.theme,
      palette: user.preference?.palette,
      locale: user.preference?.locale,
      timezone: timezone,

    } as PreferenceModel);

    setUser({ ...user, preference: preference });
    setThemePalette(preference);
    setIsEditing(false);
  }

  function ResetTimezone() {
    setTimezone(user.preference.timezone);
    setIsEditing(false);
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
    confirm_action: () => ResetTimezone(),
  } as ConfirmationDialogModel;

  var saveDetailDialog = {
    title: "Save changes?",
    dialog: "This will save your changes",
    cancel_text: "Keep Editing",
    cancel_icon: <EditOutlinedIcon />,
    confirm_text: "Save",
    confirm_icon: <SaveIcon />,
    confirm_action: () => ChangePreference(),
  } as ConfirmationDialogModel;

  return (
    <div className="info-item">
      <span className="info-label">Timezone</span>
      {isEditing ? (
        <div className="info-value">
          <Select
            variant="standard"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            fullWidth
          >
            // TODO: Add timezone options here
          </Select>
        </div>
      ) : (
        <div className="info-value">{user.preference?.timezone}</div>
      )}
      <ButtonGroup className="info-action">
        {isEditing && (
          <Button
            onClick={() => {
              setConfirmationDialog(cancelEditDetailDialog);
              setIsDialogOpen(true);
            }}
          >
            <CustomTooltip title="Cancel">
              <CancelIcon />
            </CustomTooltip>
          </Button>
        )}
        {isEditing && (
          <Button
            onClick={() => {
              setConfirmationDialog(saveDetailDialog);
              setIsDialogOpen(true);
            }}
          >
            <CustomTooltip title="Cancel">
              <SaveIcon />
            </CustomTooltip>
          </Button>
        )}
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <CustomTooltip title="Cancel">
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

export default TimezonePreference;
