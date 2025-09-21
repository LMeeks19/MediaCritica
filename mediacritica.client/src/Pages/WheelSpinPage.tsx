import "./WheelSpinPage.scss";
import { Roulette, RouletteItem, useRoulette } from "react-hook-roulette";
import TopBar from "../Components/TopBar";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { GetMediaSearchResults } from "../Server/Server";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { CustomTooltip } from "../Components/Tooltip";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Snackbar from "../Components/Snackbar";

function WheelSpinPage() {
  const [media, setMedia] = useState<RouletteItem[]>([] as RouletteItem[]);

  const options = {
    size: 600,
    showArrow: media.length > 1,
    style: {
      canvas: {
        bg: "#141414",
      },
      arrow: {
        bg: "whitesmoke",
        size: 20,
      },
      label: {
        font: "16px Orbitron",
        defaultColor: "whitesmoke",
      },
      pie: {
        border: true,
        borderColor: "whitesmoke",
        borderWidth: 2,
        theme: [
          { bg: "#971212" },
          { bg: "#E27300" },
          { bg: "#FCC400" },
          { bg: "#808900" },
          { bg: "#225353" },
          { bg: "#16A5A5" },
          { bg: "#0062B1" },
          { bg: "#653294" },
          { bg: "#FA28FF" },
        ],
      },
    },
  };

  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const { roulette, onStart, onStop, result } = useRoulette({
    items: media,
    onSpinUp: () => {
      setIsWheelSpinning(true);
      setTimeout(onStop, 1500);
    },
    onSpinEnd: () => setIsWheelSpinning(false),
    options: options,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getResults() {
    const mediaSearchResponse = await GetMediaSearchResults(searchTerm);
    setMediaSearchResults(mediaSearchResponse.search ?? []);
  }

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsLoading(true);
        await getResults();
        setIsLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleCloseAutocomplete = () => {};

  const getRenderInput = (params: any) => {
    return (
      <TextField
        {...params}
        placeholder="Search Media..."
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
              </Fragment>
            ),
          },
        }}
      />
    );
  };

  const getRenderOption = (props: any, result: any) => {
    const { key, ...resultProps } = props;
    return (
      <CustomTooltip title={`Add to wheel`}>
        <Box
          key={result.id || result.imdbID}
          component="li"
          {...resultProps}
          sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}
        >
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
            <div className="text-sm">{CapitaliseFirstLetter(result.type)}</div>
            <div className="text-xs">{result.year}</div>
          </Box>
        </Box>
      </CustomTooltip>
    );
  };

  return (
    <div className="wheelspinpage-container">
      <div className="wheelspinpage">
        <TopBar />
        <div className="header">
          <h1>Wheelspin</h1>
        </div>
        <div className="wheelspin">
          <div className="wheel">
            <Roulette roulette={roulette} />
            <div className="actions">
              <Button
                disabled={isWheelSpinning || media.length < 2}
                onClick={onStart}
              >
                SPIN THE WHEEL!
              </Button>
            </div>
          </div>
          <div className="selection-container">
            <div className="search">
              <Autocomplete
                onClose={handleCloseAutocomplete}
                fullWidth
                autoComplete
                loading={isLoading}
                filterOptions={(x) => x}
                options={mediaSearchResults}
                getOptionLabel={(result) => result.title}
                onInputChange={(_e, v) => setSearchTerm(v)}
                onChange={(_e, result) => {
                  if (media.some((m) => m.name === result!.title))
                    Snackbar.Error("This item is already in the wheel");
                  else {
                    setMedia([...media, { name: result!.title }]);
                    Snackbar.Success(`${result!.title} Added to wheel`);
                  }
                }}
                renderOption={getRenderOption}
                renderInput={getRenderInput}
              />
            </div>
            {media.length !== 0 ? (
              <div className="selection">
                {media.map((m) => {
                  return (
                    <div
                      className={`item ${result === m.name && "winner"}`}
                      key={m.name}
                    >
                      {m.name}
                      <CustomTooltip title="Remove from wheel" arrow>
                        <DeleteIcon
                          className="remove-wheel"
                          onClick={() =>
                            setMedia(
                              media.filter((media) => media.name !== m.name)
                            )
                          }
                        />
                      </CustomTooltip>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="selection empty">No media added</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WheelSpinPage;
