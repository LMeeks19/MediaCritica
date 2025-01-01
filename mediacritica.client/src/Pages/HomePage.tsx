import "./HomePage.scss";
import TopBar from "../Components/TopBar";
import { TextField, InputAdornment, Autocomplete, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import Collapsible from "../Components/Collapsible";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import {
  GetBestOfCurYear,
  GetBestOfPrevYear,
  GetSearchResults,
  GetUpcoming,
} from "../Server/Server";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { useNavigate } from "react-router-dom";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import ImageIcon from "@mui/icons-material/Image";
import { MediaSummaryModelResponse } from "../Interfaces/MediaSummaryModelResponse";

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

  async function GetUpcomingMedia(
    offset: number = 0
  ): Promise<MediaSummaryModelResponse> {
    const data = await GetUpcoming(offset);
    return data;
  }

  function GetSeasonalPicksMedia(): Promise<MediaSummaryModelResponse> {
    return {} as Promise<MediaSummaryModelResponse>;
  }

  function GetLatestMedia(): Promise<MediaSummaryModelResponse> {
    return {} as Promise<MediaSummaryModelResponse>;
  }

  function GetRecentlyReviewedMedia(): Promise<MediaSummaryModelResponse> {
    return {} as Promise<MediaSummaryModelResponse>;
  }

  function GetMostReviewedMedia(): Promise<MediaSummaryModelResponse> {
    return {} as Promise<MediaSummaryModelResponse>;
  }

  async function GetPrevYearMedia(
    offset: number = 0
  ): Promise<MediaSummaryModelResponse> {
    const data = await GetBestOfPrevYear(offset);
    return data;
  }

  async function GetCurYearMedia(
    offset: number = 0
  ): Promise<MediaSummaryModelResponse> {
    const data = await GetBestOfCurYear(offset);
    return data;
  }

  function GetBestMediaOfAllTime(): Promise<MediaSummaryModelResponse> {
    return {} as Promise<MediaSummaryModelResponse>;
  }

  return (
    <div className="homepage-container">
      <div className="homepage">
        <TopBar hideHome whiteText />
        <div className="header">
          <div className="actions">
            <Autocomplete
              sx={{ minWidth: 300, width: 1250 }}
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
        </div>
        <div className="sections">
          <Collapsible
            title="Seasonal Picks"
            request={() => GetSeasonalPicksMedia()}
          />
          <Collapsible
            title="Latest Releases"
            request={() => GetLatestMedia()}
          />
          <Collapsible
            title="Upcoming Releases"
            request={() => GetUpcomingMedia()}
          />
          <Collapsible
            title="Recently Reviewed"
            request={() => GetRecentlyReviewedMedia()}
          />
          <Collapsible
            title="Most Reviewed"
            request={() => GetMostReviewedMedia()}
          />
          <Collapsible
            title={`Best of ${currentYear} So Far`}
            request={() => GetCurYearMedia()}
          />
          <Collapsible
            title={`Best of ${currentYear - 1}`}
            request={() => GetPrevYearMedia()}
          />
          <Collapsible
            title="Best of All Time"
            request={() => GetBestMediaOfAllTime()}
          />
        </div>
        <div className="sub-header explore">
          <button className="explore-btn" onClick={() => navigate("/explore")}>
            <TravelExploreIcon />
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
