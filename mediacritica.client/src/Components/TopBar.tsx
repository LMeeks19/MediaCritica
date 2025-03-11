import "./TopBar.scss";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { notificationsState, userState } from "../State/GlobalState";
import { useEffect, useState } from "react";
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
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { GetSearchResults } from "../Server/Server";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown"

function TopBar() {
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

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([] as MediaSearchModel[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 2) {
        var mediaSearchResponse = await GetSearchResults(searchTerm);
        setMediaSearchResults(mediaSearchResponse.search ?? []);
      } else {
        setMediaSearchResults([]);
      }
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="topbar">
      <IconButton sx={{ ml: "1.25rem" }} onClick={() => navigate("/")}>
        <HomeOutlinedIcon fontSize="large" />
      </IconButton>
      <Autocomplete
        sx={{ minWidth: 300, width: 1500 }}
        fullWidth
        autoComplete
        loading={isLoading}
        filterOptions={(x) => x}
        options={mediaSearchResults}
        getOptionLabel={(result) => result.title}
        onClose={() => setMediaSearchResults([])}
        onInputChange={(_e, v) => setSearchTerm(v)}
        onChange={(_e, result) =>
          navigate(`/media/${result?.imdbID}`, {
            state: {
              mediaId: result?.imdbID,
              mediaType: result?.type,
            },
          })
        }
        renderOption={(props, result) => {
          const { key, ...resultProps } = props;
          return (
            <Box key={result.imdbID} component="li" {...resultProps}>
              {result.poster === "N/A" ? (
                <ImageIcon style={{ width: 60, height: 75 }} />
              ) : (
                <img
                  loading="lazy"
                  width="60"
                  height="75"
                  src={result.poster}
                />
              )}
              <div className="flex justify-between items-center w-full px-4 gap-2 overflow-hidden">
                <div className="flex flex-col overflow-hidden">
                  <div className="text-2xl truncate">{result.title}</div>
                  {CapitaliseFirstLetter(result.type)}
                </div>
                {result.year.endsWith("–")
                  ? `${result.year}Present`
                  : result.year}
              </div>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search..."
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    <InputAdornment position="start">
                      <ArrowDropDown />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
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
