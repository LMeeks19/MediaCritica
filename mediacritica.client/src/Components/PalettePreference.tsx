import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUserPreference } from "../Server/Server";
import { PreferenceModel } from "../Interfaces/UserModel";
import { Circle } from "@uiw/react-color";
import CancelIcon from '@mui/icons-material/CancelOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

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
    setIsEditing(false);
  }

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
      <div className="info-action">
        {isEditing && (
          <button
            disabled={!isEditing}
            className="cancel-btn"
            onClick={() => setIsEditing(false)}
          >
            Cancel <CancelIcon fontSize="small" />
          </button>
        )}
        {isEditing && (
          <button className="save-btn" onClick={() => ChangePreference()}>
            Save <SaveIcon fontSize="small" />
          </button>
        )}
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit <EditOutlinedIcon fontSize="small" />
          </button>
        )}
      </div>
    </div>
  );
}

export default PalettePreference;
