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

function ExplorePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchMediaFilter, setSearchMediaFilter] = useState<string>("");
  const [selectedMediaSorter, setSelectedMediaSorter] = useState<string>("0");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [media, setMedia] = useState<MediaModel[]>([]);
  const [baseMedia, setBaseMedia] = useState<MediaModel[]>([]);
  const navigate = useNavigate();

  // Dummy Data Will Be Removed Once Server Calls Are Implements
  const dummyMediaList: MediaModel[] = [
    {
      actors: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
      awards: "Won 3 Oscars. Another 50 wins & 79 nominations.",
      country: "USA",
      director: "Anthony Russo, Joe Russo",
      genre: "Action, Adventure, Sci-Fi",
      language: "English",
      metascore: "78",
      plot: "The Avengers assemble to reverse Thanos' actions and restore balance.",
      poster: "https://example.com/poster1.jpg",
      rated: "PG-13",
      ratings: [
        { source: "Internet Movie Database", value: "8.5/10" },
        { source: "Rotten Tomatoes", value: "94%" },
        { source: "Metacritic", value: "78/100" },
      ],
      released: "2019-04-26",
      runtime: "181 min",
      title: "Avengers: Endgame",
      type: "movie",
      writer: "Christopher Markus, Stephen McFeely, Stan Lee",
      year: "2019",
      imdbID: "tt4154796",
      imdbRating: "8.5",
      imdbVotes: "1,250,000",
    },
    {
      actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
      awards: "Won 7 Oscars. Another 25 wins & 60 nominations.",
      country: "USA",
      director: "Frank Darabont",
      genre: "Drama, Crime",
      language: "English",
      metascore: "90",
      plot: "Two imprisoned men bond over several years, finding solace and redemption.",
      poster: "https://example.com/poster2.jpg",
      rated: "R",
      ratings: [
        { source: "Internet Movie Database", value: "9.3/10" },
        { source: "Rotten Tomatoes", value: "91%" },
        { source: "Metacritic", value: "90/100" },
      ],
      released: "1994-10-14",
      runtime: "142 min",
      title: "The Shawshank Redemption",
      type: "movie",
      writer: "Stephen King, Frank Darabont",
      year: "1994",
      imdbID: "tt0111161",
      imdbRating: "9.3",
      imdbVotes: "2,345,000",
    },
    {
      actors: "Tom Cruise, Rebecca Ferguson, Simon Pegg",
      awards: "Nominated for 1 Oscar. 20 wins & 45 nominations.",
      country: "USA",
      director: "Christopher McQuarrie",
      genre: "Action, Adventure, Thriller",
      language: "English",
      metascore: "84",
      plot: "Ethan Hunt and his team take on their most impossible mission yet.",
      poster: "https://example.com/poster3.jpg",
      rated: "PG-13",
      ratings: [
        { source: "Internet Movie Database", value: "8.1/10" },
        { source: "Rotten Tomatoes", value: "89%" },
        { source: "Metacritic", value: "84/100" },
      ],
      released: "2023-07-14",
      runtime: "163 min",
      title: "Mission: Impossible – Dead Reckoning",
      type: "movie",
      writer: "Christopher McQuarrie, Bruce Geller",
      year: "2023",
      imdbID: "tt9603212",
      imdbRating: "8.1",
      imdbVotes: "430,000",
    },
    {
      actors: "Henry Cavill, Anya Chalotra, Freya Allan",
      awards:
        "Nominated for 5 Primetime Emmys. Another 12 wins & 24 nominations.",
      country: "USA",
      director: "Various",
      genre: "Fantasy, Action, Adventure",
      language: "English",
      metascore: "72",
      plot: "Geralt of Rivia, a mutated monster hunter, navigates his destiny.",
      poster: "https://example.com/poster4.jpg",
      rated: "TV-MA",
      ratings: [
        { source: "Internet Movie Database", value: "8.2/10" },
        { source: "Rotten Tomatoes", value: "85%" },
        { source: "Metacritic", value: "72/100" },
      ],
      released: "2019-12-20",
      runtime: "60 min per episode",
      title: "The Witcher",
      type: "series",
      writer: "Lauren Schmidt Hissrich, Andrzej Sapkowski",
      year: "2019",
      imdbID: "tt5180504",
      imdbRating: "8.2",
      imdbVotes: "678,000",
    },
    {
      actors: "Pedro Pascal, Bella Ramsey, Anna Torv",
      awards: "Nominated for 20 Primetime Emmys.",
      country: "USA",
      director: "Craig Mazin, Neil Druckmann",
      genre: "Drama, Sci-Fi, Thriller",
      language: "English",
      metascore: "87",
      plot: "A smuggler and a teenage girl navigate a post-apocalyptic world.",
      poster: "https://example.com/poster5.jpg",
      rated: "TV-MA",
      ratings: [
        { source: "Internet Movie Database", value: "8.8/10" },
        { source: "Rotten Tomatoes", value: "95%" },
        { source: "Metacritic", value: "87/100" },
      ],
      released: "2023-01-15",
      runtime: "55 min per episode",
      title: "The Last of Us",
      type: "series",
      writer: "Craig Mazin, Neil Druckmann",
      year: "2023",
      imdbID: "tt3581920",
      imdbRating: "8.8",
      imdbVotes: "823,000",
    },
    {
      actors: "Troy Baker, Ashley Johnson, Hana Hayes",
      awards: "Won 5 Game Awards. 20 wins & 32 nominations.",
      country: "USA",
      director: "Neil Druckmann",
      genre: "Action, Adventure",
      language: "English",
      metascore: "95",
      plot: "Joel and Ellie navigate a post-apocalyptic world full of danger.",
      poster: "https://example.com/poster6.jpg",
      rated: "M",
      ratings: [
        { source: "Internet Movie Database", value: "9.0/10" },
        { source: "Metacritic", value: "95/100" },
      ],
      released: "2013-06-14",
      runtime: "20-25 hours (gameplay)",
      title: "The Last of Us",
      type: "game",
      writer: "Neil Druckmann",
      year: "2013",
      imdbID: "tt2140553",
      imdbRating: "9.0",
      imdbVotes: "210,000",
    },
    {
      actors: "Leonardo DiCaprio, Kate Winslet, Billy Zane",
      awards: "Won 11 Oscars. Another 116 wins & 83 nominations.",
      country: "USA",
      director: "James Cameron",
      genre: "Drama, Romance",
      language: "English",
      metascore: "75",
      plot: "A love story unfolds aboard the ill-fated RMS Titanic.",
      poster: "https://example.com/poster7.jpg",
      rated: "PG-13",
      ratings: [
        { source: "Internet Movie Database", value: "7.8/10" },
        { source: "Rotten Tomatoes", value: "89%" },
        { source: "Metacritic", value: "75/100" },
      ],
      released: "1997-12-19",
      runtime: "195 min",
      title: "Titanic",
      type: "movie",
      writer: "James Cameron",
      year: "1997",
      imdbID: "tt0120338",
      imdbRating: "7.8",
      imdbVotes: "1,234,000",
    },
    {
      actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
      awards: "Won 3 Oscars. Another 86 wins & 131 nominations.",
      country: "USA",
      director: "James Cameron",
      genre: "Action, Adventure, Fantasy",
      language: "English",
      metascore: "83",
      plot: "A paraplegic marine explores Pandora and joins its indigenous people.",
      poster: "https://example.com/poster8.jpg",
      rated: "PG-13",
      ratings: [
        { source: "Internet Movie Database", value: "7.9/10" },
        { source: "Rotten Tomatoes", value: "82%" },
        { source: "Metacritic", value: "83/100" },
      ],
      released: "2009-12-18",
      runtime: "162 min",
      title: "Avatar",
      type: "movie",
      writer: "James Cameron",
      year: "2009",
      imdbID: "tt0499549",
      imdbRating: "7.9",
      imdbVotes: "1,100,000",
    },
    {
      actors: "David Hayter, Quinton Flynn, Josh Keaton",
      awards: "Won 2 BAFTA Games Awards.",
      country: "Japan",
      director: "Hideo Kojima",
      genre: "Action, Stealth",
      language: "English, Japanese",
      metascore: "94",
      plot: "A legendary soldier fights to stop a nuclear-equipped robot.",
      poster: "https://example.com/poster9.jpg",
      rated: "M",
      ratings: [
        { source: "Internet Movie Database", value: "9.5/10" },
        { source: "Metacritic", value: "94/100" },
      ],
      released: "2004-11-17",
      runtime: "20-25 hours (gameplay)",
      title: "Metal Gear Solid 3: Snake Eater",
      type: "game",
      writer: "Hideo Kojima",
      year: "2004",
      imdbID: "tt0435585",
      imdbRating: "9.5",
      imdbVotes: "120,000",
    },
    {
      actors: "Elijah Wood, Ian McKellen, Viggo Mortensen",
      awards: "Won 11 Oscars. Another 125 wins & 100 nominations.",
      country: "New Zealand",
      director: "Peter Jackson",
      genre: "Action, Adventure, Drama",
      language: "English",
      metascore: "94",
      plot: "Frodo and Sam reach Mordor to destroy the One Ring.",
      poster: "https://example.com/poster10.jpg",
      rated: "PG-13",
      ratings: [
        { source: "Internet Movie Database", value: "9.0/10" },
        { source: "Rotten Tomatoes", value: "93%" },
        { source: "Metacritic", value: "94/100" },
      ],
      released: "2003-12-17",
      runtime: "201 min",
      title: "The Lord of the Rings: The Return of the King",
      type: "movie",
      writer: "J.R.R. Tolkien, Fran Walsh, Philippa Boyens",
      year: "2003",
      imdbID: "tt0167260",
      imdbRating: "9.0",
      imdbVotes: "1,756,000",
    },
  ];

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

  useEffect(() => {
    FetchExplore();
  }, []);

  function FetchExplore() {
    setIsLoading(true);
    setBaseMedia(dummyMediaList);
    setMedia(dummyMediaList);
    setIsLoading(false);
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
