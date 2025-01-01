import "./HomePage.scss";
import TopBar from "../Components/TopBar";
import { TextField, InputAdornment, Autocomplete, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import Collapsible from "../Components/Collapsible";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";
import { GetSearchResults } from "../Server/Server";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { useNavigate } from "react-router-dom";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import ImageIcon from "@mui/icons-material/Image";

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

  function GetTrendingMedia(): MediaSummaryModel[] {
    return [] as MediaSummaryModel[];
  }

  function GetUpcomingMedia(): MediaSummaryModel[] {
    return [] as MediaSummaryModel[];
  }

  function GetPrevYearMedia(): MediaSummaryModel[] {
    return [] as MediaSummaryModel[];
  }

  function GetCurYearMedia(): MediaSummaryModel[] {
    return [] as MediaSummaryModel[];
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
                      <img loading="lazy" width="60" height="75" src={result.poster} />
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
            title="Trending Media"
            request={() => GetTrendingMedia()}
          />
          <Collapsible
            title="Upcoming Media"
            request={() => GetUpcomingMedia()}
          />

          <Collapsible
            title={`Best of ${currentYear} (So Far)`}
            request={() => GetCurYearMedia()}
          />
          <Collapsible
            title={`Best of ${currentYear - 1}`}
            request={() => GetPrevYearMedia()}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
