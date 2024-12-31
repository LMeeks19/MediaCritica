import "./ExplorePage.scss";
import { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import TopBar from "../Components/TopBar";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Divider,
  Fab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SortIcon from "@mui/icons-material/Sort";
import ExploreFiltersDialog from "../Components/ExploreFiltersDialog";
import GradeIcon from "@mui/icons-material/Grade";
import { format } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { useNavigate } from "react-router-dom";
import { GetExploreMedia, GetExploreMediaBySearch } from "../Server/Server";
import { CustomTooltip } from "../Components/Tooltip";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";
import AddIcon from "@mui/icons-material/Add";

function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchMediaFilter, setSearchMediaFilter] = useState<string>("");
  const [selectedMediaSorter, setSelectedMediaSorter] = useState<string>("0");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [media, setMedia] = useState<MediaSummaryModel[]>([]);
  const [baseMedia, setBaseMedia] = useState<MediaSummaryModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    FetchExplore(0);
  }, []);

  async function FetchExplore(offset: number) {
    setIsLoading(true);
    if (baseMedia.length < totalCount) {
      const medaiaData = await GetExploreMedia(offset);
      setBaseMedia([...baseMedia, ...medaiaData.mediaSummaryModels]);
      setMedia([...media, ...medaiaData.mediaSummaryModels]);
      setTotalCount(medaiaData.totalMediaCount);
    }
    setIsLoading(false);
  }

  function GetSearchFilteredItems() {
    return media.filter((media) =>
      media.title.toLowerCase().startsWith(searchMediaFilter.toLowerCase())
    );
  }

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      if (
        GetSearchFilteredItems().length === 0 &&
        searchMediaFilter.length > 0
      ) {
        const data = await GetExploreMediaBySearch(searchMediaFilter);
        setMedia([...media, ...data]);
        setBaseMedia([...baseMedia, ...data]);
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchMediaFilter]);

  function Sorted(data: MediaSummaryModel[]): MediaSummaryModel[] {
    let items = [...data];

    switch (selectedMediaSorter) {
      case "1":
        return items.sort((a, b) => b.title.localeCompare(a.title));
      case "2":
        return items.sort(
          (a, b) => Number(b.imdbRating) - Number(a.imdbRating)
        );
      case "3":
        return items.sort(
          (a, b) => Number(a.imdbRating) - Number(b.imdbRating)
        );
      case "4":
        return items.sort(
          (a, b) =>
            new Date(b.released).getTime() - new Date(a.released).getTime()
        );
      case "5":
        return items.sort(
          (a, b) =>
            new Date(a.released).getTime() - new Date(b.released).getTime()
        );
      default:
        return items.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return (
    <div className="explorepage-container">
      <div className="explore">
        <TopBar whiteText />
        <div className="header">
          <h1>Explore</h1>
          <div className="actions">
            <TextField
              variant="outlined"
              label="Search"
              placeholder="Enter Media Title..."
              value={searchMediaFilter}
              onChange={(e) => setSearchMediaFilter(e.target.value)}
              sx={{ minWidth: 225, width: 400 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 250, width: 275 }}>
              <InputLabel>Sort</InputLabel>
              <Select
                label="Sort"
                disabled={isLoading}
                value={selectedMediaSorter}
                onChange={(e) => setSelectedMediaSorter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="0">Alphabetical (A-Z)</MenuItem>
                <MenuItem value="1">Alphabetical (Z-A)</MenuItem>
                <MenuItem value="2">Rating (High-Low)</MenuItem>
                <MenuItem value="3">Rating (Low-High)</MenuItem>
                <MenuItem value="4">Release (New-Old)</MenuItem>
                <MenuItem value="5">Release (Old-New)</MenuItem>
              </Select>
            </FormControl>
            <CustomTooltip title="Advanced Filters" arrow>
              <span>
                <Button
                  className={`h-full ${isFilterDialogOpen ? "active" : ""}`}
                  variant="outlined"
                  disabled={isLoading}
                  onClick={() => setIsFilterDialogOpen(true)}
                >
                  <FilterAltOutlinedIcon />
                </Button>
              </span>
            </CustomTooltip>
            <ExploreFiltersDialog
              items={baseMedia}
              setItems={setMedia}
              isOpen={isFilterDialogOpen}
              setIsOpen={setIsFilterDialogOpen}
            />
          </div>
        </div>
        <div className="content">
          {isLoading ? (
            <Loader />
          ) : GetSearchFilteredItems().length === 0 && !isLoading ? (
            <div className="items empty">No Media</div>
          ) : (
            <div className="items">
              {Sorted(GetSearchFilteredItems()).map((item) => {
                return (
                  <Card key={item.id}>
                    <CardActionArea
                      onClick={() =>
                        navigate(`/media/${item.id}`, {
                          state: {
                            mediaId: item.id,
                            mediaType: item.type,
                          },
                        })
                      }
                    >
                      <CardMedia
                        component="img"
                        image={item.poster}
                        alt={`${item.title}} cover art`}
                      />
                      <CardHeader title={item.title} />
                      <Divider />
                      <CardContent>
                        <Typography>{item.genre}</Typography>
                        <Typography>
                          {format(item.released, "do MMMM yyyy")}
                        </Typography>
                        <div className="chips">
                          <div className="rating">
                            <GradeIcon className="icon" />
                            <div className="value">{item.imdbRating}</div>
                          </div>
                          <div>{CapitaliseFirstLetter(item.type)}</div>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
              <div
                className={`flex justify-center items-center p-6 ${
                  baseMedia.length >= totalCount && "hidden"
                }`}
              >
                <CustomTooltip title="Load more" arrow>
                  <span>
                    <Fab
                      className="load-btn"
                      onClick={() => FetchExplore(baseMedia.length)}
                    >
                      <AddIcon />
                    </Fab>
                  </span>
                </CustomTooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
