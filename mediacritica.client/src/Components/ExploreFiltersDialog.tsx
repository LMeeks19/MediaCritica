import { SetterOrUpdater } from "recoil";
import {
  Dialog,
  DialogTitle,
  Fab,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  MenuItem,
  Autocomplete,
  TextField,
  DialogActions,
  Slider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";

function ExploreFiltersDialog(props: ExploreFiltersDialogProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(
    null
  );
  const [selectedRatingFilter, setSelectedRatingFIlter] = useState<number[]>([
    0, 10,
  ]);

  const genres: string[] = [
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "History",
    "War",
    "Western",
    "Musical",
    "Animation",
    "Biography",
    "Documentary",
    "Family",
    "Sport",
  ].sort((a, b) => a.localeCompare(b));

  function ResetFields() {
    setSelectedTypeFilter("all");
    setSelectedGenreFilter([]);
    setSelectedDateFilter(null);
    setSelectedRatingFIlter([0, 10]);
  }

  function ApplyFilters() {
    let items = [...props.items];

    if (selectedTypeFilter !== "all")
      items = items.filter((item) => item.type === selectedTypeFilter);

    if (selectedGenreFilter.length !== 0)
      items = items.filter((item) =>
        selectedGenreFilter.some((selectedGenre) =>
          item.genre.split(", ").includes(selectedGenre)
        )
      );

    if (selectedDateFilter !== null)
      items = items.filter(
        (item) =>
          new Date(item.released).getFullYear() ===
          selectedDateFilter.getFullYear()
      );

    items = items.filter(
      (item) =>
        Number(item.imdbRating) >= selectedRatingFilter.at(0)! &&
        Number(item.imdbRating) <= selectedRatingFilter.at(1)!
    );

    props.setItems(items);
    props.setIsOpen(false);
  }

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 8,
      label: "8",
    },
    {
      value: 9,
      label: "9",
    },
    {
      value: 10,
      label: "10",
    },
  ];

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={props.isOpen}
      onClose={() => {
        ResetFields();
        props.setIsOpen(false);
      }}
      scroll="paper"
    >
      <DialogTitle>
        Filters
        <Fab size="small" onClick={() => props.setIsOpen(false)}>
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent dividers>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FilterAltOutlinedIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="movie">Movies</MenuItem>
            <MenuItem value="series">Series</MenuItem>
            <MenuItem value="game">Games</MenuItem>
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          limitTags={3}
          options={genres}
          fullWidth
          value={selectedGenreFilter}
          onChange={(_e, values) => setSelectedGenreFilter(values)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Genre"
              placeholder="Add Genre..."
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <Fragment>
                      <InputAdornment position="start">
                        <FilterAltOutlinedIcon />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </Fragment>
                  ),
                },
              }}
            />
          )}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="flex gap-6">
            <DatePicker
              className="flex-1"
              label="Year"
              views={["year"]}
              maxDate={new Date()}
              openTo="year"
              yearsOrder="desc"
              value={selectedDateFilter}
              onChange={(v) => setSelectedDateFilter(v)}
              slotProps={{
                textField: {
                  placeholder: "Select Year...",
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterAltOutlinedIcon />
                      </InputAdornment>
                    ),
                  },
                },
                field: {
                  clearable: true,
                  onClear: () => setSelectedDateFilter(new Date()),
                },
              }}
            />
          </div>
        </LocalizationProvider>

        <Box>
          <div>Rating</div>
          <Slider
            value={selectedRatingFilter}
            onChange={(_e, v) => setSelectedRatingFIlter(v as number[])}
            shiftStep={1}
            marks={marks}
            step={1}
            min={0}
            max={10}
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <button className="reset-btn" onClick={() => ResetFields()}>
          Reset
        </button>
        <button className="cancel-btn" onClick={() => props.setIsOpen(false)}>
          Cancel
        </button>
        <button className="apply-btn" onClick={() => ApplyFilters()}>
          Apply
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ExploreFiltersDialog;

interface ExploreFiltersDialogProps {
  items: MediaSummaryModel[];
  setItems: SetterOrUpdater<MediaSummaryModel[]>;
  isOpen: boolean;
  setIsOpen: SetterOrUpdater<boolean>;
}
