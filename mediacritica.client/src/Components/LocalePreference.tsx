import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUserPreference } from "../Server/Server";
import { PreferenceModel } from "../Interfaces/UserModel";
import { Button, ButtonGroup, Autocomplete, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CustomTooltip } from "./Tooltip";
import { setThemePalette } from "../Helpers/ThemePaletteHelper";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import ConfirmationDialog from "./ConfirmationDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import * as LocaleCodes from "locale-codes";

function LocalePreference() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userState);

  const [locale, setLocale] = useState<string>();

  async function ChangePreference() {
    const preference = await UpdateUserPreference({
      id: user.preference.id,
      theme: user.preference?.theme,
      palette: user.preference?.palette,
      locale: locale,
      timezone: user.preference?.timezone,
    } as PreferenceModel);

    setUser({ ...user, preference: preference });
    setThemePalette(preference);
    setIsEditing(false);
  }

  function ResetLocale() {
    setLocale(user.preference.locale);
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
    confirm_action: () => ResetLocale(),
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

  const locales = LocaleCodes.all.map((locale) => locale);

  return (
    <div className="info-item">
      <span className="info-label">Locale</span>
      {isEditing ? (
        <div className="info-value">
          <Autocomplete
            options={locales}
            getOptionLabel={(option) =>
              `${option.name} ${
                option.location !== null ? `(${option.location})` : ""
              }`
            }
            onChange={(_e, v) => setLocale(v?.tag as string)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Enter new locale" />
            )}
            fullWidth
          />
        </div>
      ) : (
        <div className="info-value">
          {LocaleCodes.getByTag(user.preference.locale).name} (
          {LocaleCodes.getByTag(user.preference.locale).location})
        </div>
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

export default LocalePreference;
