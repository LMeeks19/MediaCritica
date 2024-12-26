import { faCancel, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UpdateUserPreference } from "../Server/Server";
import { PreferenceModel } from "../Interfaces/UserModel";
import { Select, MenuItem } from "@mui/material";

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
    setIsEditing(false);
  }

  return (
    <div className="info-item">
      <span className="info-label">Theme</span>
      {isEditing ? (
        <div className="info-value">
          <Select
            className="select"
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
      <div className="info-action">
        {isEditing && (
          <button
            disabled={!isEditing}
            className="cancel-btn"
            onClick={() => setIsEditing(false)}
          >
            Cancel <FontAwesomeIcon icon={faCancel} />
          </button>
        )}
        {isEditing && (
          <button className="save-btn" onClick={() => ChangePreference()}>
            Save <FontAwesomeIcon icon={faSave} />
          </button>
        )}
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ThemePreference;
