import { useEffect, useState } from "react";
import "./ExplorePage.scss";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SortIcon from "@mui/icons-material/Sort";
import ExploreFiltersDialog from "../Components/ExploreFiltersDialog";
import { MediaModel } from "../Interfaces/MediaModel";
import GradeIcon from "@mui/icons-material/Grade";
import { format } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { useNavigate } from "react-router-dom";
import { GetExploreMedia } from "../Server/Server";

function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchMediaFilter, setSearchMediaFilter] = useState<string>("");
  const [selectedMediaSorter, setSelectedMediaSorter] = useState<string>("0");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [media, setMedia] = useState<MediaModel[]>([]);
  const [baseMedia, setBaseMedia] = useState<MediaModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    FetchExplore();
  }, []);

  async function FetchExplore() {
    setIsLoading(true);
    const medaiaData = await GetExploreMedia(0);
    setBaseMedia(medaiaData);
    setMedia(medaiaData);
    setIsLoading(false);
  }

  function Sorted(media: MediaModel[]): MediaModel[] {
    let items = [...media];
    if (selectedMediaSorter === "1")
      return items.sort((a, b) => b.title.localeCompare(a.title));
    else if (selectedMediaSorter === "2")
      return items.sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating));
    else if (selectedMediaSorter === "3")
      return items.sort((a, b) => Number(a.imdbRating) - Number(b.imdbRating));
    else if (selectedMediaSorter === "4")
      return items.sort(
        (a, b) =>
          new Date(b.released).getTime() - new Date(a.released).getTime()
      );
    else if (selectedMediaSorter === "5")
      return items.sort(
        (a, b) =>
          new Date(a.released).getTime() - new Date(b.released).getTime()
      );
    return items.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="explorepage-container">
      {isLoading ? (
        <Loader />
      ) : (
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
              <FormControl
                variant="outlined"
                sx={{ minWidth: 250, width: 275 }}
              >
                <InputLabel>Sort</InputLabel>
                <Select
                  label="Sort"
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

              <Button
                variant="outlined"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <FilterAltOutlinedIcon />
              </Button>
              <ExploreFiltersDialog
                items={baseMedia}
                setItems={setMedia}
                isOpen={isFilterDialogOpen}
                setIsOpen={setIsFilterDialogOpen}
              />
            </div>
          </div>
          <div className="content">
            <div className="items">
              {Sorted(
                media.filter((item) => item.title.startsWith(searchMediaFilter))
              ).map((item) => {
                return (
                  <Card key={item.imdbID}>
                    <CardActionArea
                      onClick={() =>
                        navigate(`/media/${item.imdbID}`, {
                          state: {
                            mediaId: item.imdbID,
                            MediaType: item.type,
                          },
                        })
                      }
                    >
                      <CardMedia
                        component="img"
                        image={item.poster}
                        alt={`${item.title}} cover art`}
                      />
                      <Divider />
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExplorePage;
