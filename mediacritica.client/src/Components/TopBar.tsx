import "./TopBar.scss";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { notificationsState, userState } from "../State/GlobalState";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { resetThemePalette } from "../Helpers/ThemePaletteHelper";
import { UserModel } from "../Interfaces/UserModel";
import NotificationOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { NotificationModel } from "../Interfaces/NotificationModel";

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  const setNotifications = useSetRecoilState(notificationsState);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={`topbar ${props.whiteText ? "white-text" : ""}`}>
      <IconButton sx={{ ml: "1.25rem" }} onClick={() => navigate("/")}>
        <HomeOutlinedIcon fontSize="large" />
      </IconButton>
      <div style={{ marginRight: "1.25rem" }}>
        <IconButton onClick={handleClick}>
          <MenuIcon fontSize="large" />
        </IconButton>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => navigate("/")}>
          <ListItemIcon>
            <HomeOutlinedIcon />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={() => navigate("/explore")}>
          <ListItemIcon>
            <TravelExploreIcon />
          </ListItemIcon>
          Explore
        </MenuItem>
        <MenuItem onClick={() => navigate("/leaderboards")}>
          <ListItemIcon>
            <LeaderboardOutlinedIcon />
          </ListItemIcon>
          Leaderboards
        </MenuItem>
        <Divider />
        {user.id === undefined && (
          <MenuItem onClick={() => navigate("/login")}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
        {user.id !== undefined && (
          <MenuItem onClick={() => navigate("/account")}>
            <ListItemIcon>
              <AccountCircleOutlinedIcon />
            </ListItemIcon>
            Account
          </MenuItem>
        )}
        {user.id !== undefined && (
          <MenuItem onClick={() => navigate("/notifications")}>
            <ListItemIcon>
              <NotificationOutlinedIcon />
            </ListItemIcon>
            Notifications
          </MenuItem>
        )}
        {user.id !== undefined && (
          <MenuItem
            onClick={() => {
              resetThemePalette();
              setUser({} as UserModel);
              setNotifications([] as NotificationModel[]);
              if (location.pathname.endsWith("/account")) navigate("/login");
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default TopBar;

interface TopBarProps {
  whiteText?: boolean;
}
