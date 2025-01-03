import "./HomePage.scss";
import TopBar from "../Components/TopBar";
import { TextField, InputAdornment, Autocomplete, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import {
  CollapsibleSection,
  CollapsibleTabSection,
} from "../Components/CollapsibleSections";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import {
  GetBestOfAllTime,
  GetBestOfCurYear,
  GetBestOfPrevYear,
  GetLatest,
  GetMostReviewed,
  GetRecentlyReviewed,
  GetSearchResults,
  GetSeasonalPicks,
  GetUpcoming,
} from "../Server/Server";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { useNavigate } from "react-router-dom";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import ImageIcon from "@mui/icons-material/Image";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentYear = new Date().getFullYear();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([] as MediaSearchModel[]);
  const navigate = useNavigate();

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
    <div className="homepage-container">
      <div className="homepage">
        <TopBar hideHome whiteText />
        <div className="header">
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
                variant="outlined"
                label="Search"
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
                  },
                }}
              />
            )}
          />
        </div>
        <div className="sections">
          <CollapsibleSection
            title="Seasonal Picks"
            request={() => GetSeasonalPicks()}
            defaultIsOpen={true}
          />

          <CollapsibleTabSection
            title="New & Upcoming"
            tabs={[
              {
                label: "Latest Releases",
                request: () => GetLatest(),
              },
              {
                label: "Upcoming Releases",
                request: () => GetUpcoming(),
              },
            ]}
            defaultIsOpen={true}
          />

          <CollapsibleTabSection
            title="Yearly Highlights"
            tabs={[
              {
                label: `Best of ${currentYear - 1}`,
                request: () => GetBestOfPrevYear(),
              },
              {
                label: `Best of ${currentYear} (So Far)`,
                request: () => GetBestOfCurYear(),
              },
            ]}
            defaultIsOpen={false}
          />

          <CollapsibleTabSection
            title="Community Highlights"
            tabs={[
              {
                label: "Recently Reviewed",
                request: () => GetRecentlyReviewed(),
              },
              {
                label: "Most Reviewed",
                request: () => GetMostReviewed(),
              },
            ]}
            defaultIsOpen={false}
          />

          <CollapsibleSection
            title="Best of All Time"
            request={() => GetBestOfAllTime()}
            defaultIsOpen={false}
          />
        </div>
        <div className="sub-header actions">
          <button className="explore-btn" onClick={() => navigate("/explore")}>
            <TravelExploreIcon />
            Explore
          </button>
          <button className="leaderboards-btn" onClick={() => navigate("/leaderboards")}>
            <LeaderboardIcon />
            Leaderboards
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
