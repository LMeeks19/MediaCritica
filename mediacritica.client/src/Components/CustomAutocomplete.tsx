import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { GetMediaSearchResults, GetUserSearchResults } from "../Server/Server";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PermMediaIconOutlined from "@mui/icons-material/PermMediaOutlined";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { UserSearchModel } from "../Interfaces/UserSearchModel";
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomTooltip } from "./Tooltip";
import "./CustomAutocomplete.scss";

function CustomAutoComplete() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([]);
  const [usersSearchResults, setUserSearchResults] = useState<
    UserSearchModel[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSearchTab, setSelectedSearchTab] = useState<number>(0); // 0 for media, 1 for users

  // Method for fetching results based on selected tab
  async function getResults() {
    if (selectedSearchTab === 0) {
      setUserSearchResults([]); // Clear previous user results
      const mediaSearchResponse = await GetMediaSearchResults(searchTerm);
      setMediaSearchResults(mediaSearchResponse.search ?? []);
    } else if (selectedSearchTab === 1) {
      setMediaSearchResults([]); // Clear previous media results
      const usersSearchResponse = await GetUserSearchResults(searchTerm);
      setUserSearchResults(usersSearchResponse ?? []);
    }
  }

  // Handle search term changes and trigger API call after delay
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsLoading(true);
        await getResults();
        setIsLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedSearchTab]);

  // Handle tab switch (media or users)
  const handleTabClick = (e: React.MouseEvent, tabIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSearchTab(tabIndex);
  };

  // Method to close the autocomplete
  const handleCloseAutocomplete = () => {
    setMediaSearchResults([]);
    setUserSearchResults([]);
  };

  // Method to handle the rendering of the search input field based on the selected tab
  const getRenderInput = (params: any) => {
    return (
      <TextField
        {...params}
        placeholder={`Search ${
          selectedSearchTab === 0 ? "Media..." : "Users..."
        }`}
        slotProps={{
          input: {
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <Fragment>
                {isLoading && (
                  <InputAdornment position="start">
                    <CircularProgress size={"20px"} />
                  </InputAdornment>
                )}
                <InputAdornment position="start">
                  {selectedSearchTab === 0 ? (
                    <PermMediaIcon />
                  ) : (
                    <CustomTooltip title="Activate media search" arrow>
                      <PermMediaIconOutlined
                        sx={{ cursor: "pointer" }}
                        onClick={(e) => handleTabClick(e, 0)}
                      />
                    </CustomTooltip>
                  )}
                </InputAdornment>
                <InputAdornment position="start">
                  {selectedSearchTab === 1 ? (
                    <AccountCircleIcon />
                  ) : (
                    <CustomTooltip title="Activate users search" arrow>
                      <AccountCircleOutlinedIcon
                        sx={{ cursor: "pointer" }}
                        onClick={(e) => handleTabClick(e, 1)}
                      />
                    </CustomTooltip>
                  )}
                </InputAdornment>
              </Fragment>
            ),
          },
        }}
      />
    );
  };

  // Dynamic renderOption based on selected tab (media or users)
  const getRenderOption = (props: any, result: any) => {
    const { key, ...resultProps } = props;
    return (
      <Box key={result.id || result.imdbID} component="li" {...resultProps}>
        {selectedSearchTab === 0 ? (
          // Render media options - Full media card style for media results
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {result.poster === "N/A" ? (
              <ImageIcon style={{ width: 60, height: 75 }} />
            ) : (
              <img loading="lazy" width="60" height="75" src={result.poster} />
            )}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div className="text-xl">{result.title}</div>
              <div className="text-sm">
                {CapitaliseFirstLetter(result.type)}
              </div>
              <div className="text-xs">{result.year}</div>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <AccountCircleIcon
              style={{ width: 60, height: 60, color: "var(--light-dark)" }}
            />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div className="text-xl">{result.fullName}</div>
              <div className="text-sm">Joined: {result.joined}</div>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Autocomplete
      onClose={handleCloseAutocomplete}
      sx={{ minWidth: 300, width: 1000 }}
      fullWidth
      autoComplete
      loading={isLoading}
      filterOptions={(x) => x}
      options={
        selectedSearchTab === 0 ? mediaSearchResults : usersSearchResults
      }
      getOptionLabel={(result) =>
        selectedSearchTab === 0 ? result.title : result.fullName
      }
      onInputChange={(_e, v) => setSearchTerm(v)} // Use the method to handle input change
      onChange={(_e, result) => {
        if (selectedSearchTab === 0 && result?.imdbID) {
          navigate(`/media/${result.imdbID}`, {
            state: {
              mediaId: result.imdbID,
              mediaType: result.type,
            },
          });
        } else if (selectedSearchTab === 1 && result?.id) {
          navigate(`/view-user/${result.fullName}`, {
            state: {
              userId: result.id,
            },
          });
        }
      }}
      renderOption={getRenderOption} // Use the dynamically assigned method to render options
      renderInput={getRenderInput} // Use the method to render the input field
    />
  );
}

export default CustomAutoComplete;
