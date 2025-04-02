import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUserPreference } from "../Server/Server";
import { PreferenceModel } from "../Interfaces/UserModel";
import { Circle } from "@uiw/react-color";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button, ButtonGroup } from "@mui/material";
import { CustomTooltip } from "./Tooltip";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import ConfirmationDialog from "./ConfirmationDialog";
import { setThemePalette } from "../Helpers/ThemePaletteHelper";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

function PalettePreference() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userState);

  const [palette, setPalette] = useState<string>(user.preference?.palette);

  async function ChangePreference() {
    const preference = await UpdateUserPreference({
      id: user.preference.id,
      theme: user.preference?.theme,
      palette: palette,
    } as PreferenceModel);

    setUser({ ...user, preference: preference });
    setThemePalette(preference);
    setIsEditing(false);
  }

  function ResetPalette() {
    setPalette(user.preference.palette);
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
    confirm_action: () => ResetPalette(),
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
      <span className="info-label">Palette</span>
      {isEditing ? (
        <div className="info-value">
          <Circle
            style={{
              backgroundColor: "transparent",
              width: "100%",
              padding: 0,
              margin: 0,
            }}
            color={palette}
            colors={[
              "#971212",
              "#E27300",
              "#FCC400",
              "#808900",
              "#225353",
              "#16A5A5",
              "#0062B1",
              "#653294",
              "#FA28FF",
            ]}
            onChange={(colour) => setPalette(colour.hex)}
          />
        </div>
      ) : (
        <div className="info-value">{user.preference?.palette}</div>
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
            <CustomTooltip title="Save">
              <SaveIcon />
            </CustomTooltip>
          </Button>
        )}
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <CustomTooltip title="Edit">
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

export default PalettePreference;
