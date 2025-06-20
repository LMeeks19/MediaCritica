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
import HomeIcon from "@mui/icons-material/Home";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationIcon from "@mui/icons-material/Notifications";
import CustomAutoComplete from "./CustomAutocomplete";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import { CustomTooltip } from "./Tooltip";
import { LogoutUser } from "../Helpers/AuthenticationHelper";
import RandomIcon from "@mui/icons-material/Casino";
import { SurpriseMe } from "../Server/Server";

function TopBar(props: { hideBack?: boolean }) {
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

  async function selectRandomMedia() {
    const response = await SurpriseMe();
    navigate(`/${response.type}/${response.id}`);
  }

  return (
    <div className="topbar">
      <div className="flex gap-2 ml-[1.25rem]">
        <IconButton
          className={`${props.hideBack && "hidden"}`}
          onClick={() => navigate(-1)}
        >
          <CustomTooltip title="Back">
            <ArrowCircleLeftIcon fontSize="large" />
          </CustomTooltip>
        </IconButton>
        <IconButton onClick={() => navigate("/")}>
          <CustomTooltip title="Home">
            <HomeIcon fontSize="large" />
          </CustomTooltip>
        </IconButton>
      </div>
      <CustomAutoComplete />
      <div className="mr-[1.25rem]">
        <IconButton onClick={handleClick}>
          <CustomTooltip title="Menu">
            <MenuIcon fontSize="large" />
          </CustomTooltip>
        </IconButton>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={() => navigate("/")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={() => navigate("/explore")}>
          <ListItemIcon>
            <TravelExploreIcon />
          </ListItemIcon>
          Explore
        </MenuItem>
        <MenuItem onClick={() => selectRandomMedia()}>
          <ListItemIcon>
            <RandomIcon />
          </ListItemIcon>
          Surprise Me
        </MenuItem>
        <MenuItem onClick={() => navigate("/leaderboards")}>
          <ListItemIcon>
            <LeaderboardIcon />
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
              <AccountCircleIcon />
            </ListItemIcon>
            Account
          </MenuItem>
        )}
        {user.id !== undefined && (
          <MenuItem onClick={() => navigate("/notifications")}>
            <ListItemIcon>
              <NotificationIcon />
            </ListItemIcon>
            Notifications
          </MenuItem>
        )}
        {user.id !== undefined && (
          <MenuItem
            onClick={async () => {
              await LogoutUser(setNotifications, setUser);
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
        {user.id !== undefined && user.isAdmin && (
          <>
            <Divider />
            <MenuItem onClick={() => navigate("/admin")}>
              <ListItemIcon>
                <AdminIcon />
              </ListItemIcon>
              Admin
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}

export default TopBar;
