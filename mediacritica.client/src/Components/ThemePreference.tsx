import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUserPreference } from "../Server/Server";
import { PreferenceModel } from "../Interfaces/UserModel";
import { Select, MenuItem, Button, ButtonGroup } from "@mui/material";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CustomTooltip } from "./Tooltip";
import { setThemePalette } from "../Helpers/ThemePaletteHelper";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import ConfirmationDialog from "./ConfirmationDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

function ThemePreference() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userState);

  const [theme, setTheme] = useState<string>(user.preference?.theme);

  async function ChangePreference() {
    const preference = await UpdateUserPreference({
      id: user.preference.id,
      theme: theme,
      palette: user.preference?.palette,
    } as PreferenceModel);

    setUser({ ...user, preference: preference });
    setThemePalette(preference);
    setIsEditing(false);
  }

  function ResetTheme() {
    setTheme(user.preference.theme);
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
    confirm_action: () => ResetTheme(),
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
      <span className="info-label">Theme</span>
      {isEditing ? (
        <div className="info-value">
          <Select
            variant="standard"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            fullWidth
          >
            <MenuItem value="System">System</MenuItem>
            <MenuItem value="Light">Light</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </Select>
        </div>
      ) : (
        <div className="info-value">{user.preference?.theme}</div>
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

export default ThemePreference;
