import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import TopBar from "../Components/TopBar";
import "./LeaderboardsPage.scss";
import { useEffect, useState } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { UserRankingModel } from "../Interfaces/UserRankingModel";
import { GetMediaTrends, GetUserRankings } from "../Server/Server";
import Loader from "../Components/Loader";
import { MediaTrendModel } from "../Interfaces/MediaTrendModel";

function LeaderboardsPage() {
  const [isRankingsLoading, setIsRankingsLoading] = useState<boolean>(true);
  const [rankings, setRankings] = useState<UserRankingModel[]>(
    [] as UserRankingModel[]
  );
  const [selectedRankingTimeFrame, setSelectedRankingTimeFrame] =
    useState<string>("week");

  useEffect(() => {
    GetRankings();
  }, [selectedRankingTimeFrame]);

  async function GetRankings() {
    setIsRankingsLoading(true);
    if (
      rankings.filter((item) => item.timeframe === selectedRankingTimeFrame)
        .length === 0
    ) {
      var rankingData = await GetUserRankings(selectedRankingTimeFrame);
      setRankings([...rankings, ...rankingData]);
    }
    setIsRankingsLoading(false);
  }

  const [isTrendsLoading, setIsTrendsLoading] = useState<boolean>(true);
  const [trends, setTrends] = useState<MediaTrendModel[]>(
    [] as MediaTrendModel[]
  );
  const [selectedTrendFilters, setSelectedTrendFilters] = useState<string[]>(
    []
  );
  const [selectedTrendTimeFrame, setSelectedTrendTimeFrame] =
    useState<string>("week");

  const awards = [
    "Rising Star",
    "Falling Star",
    "Surprise",
    "Most Reviewed",
    "Highest Rated",
    "Comeback",
    "Most Active Genre",
    "Most Backlogged",
    "Most Unfinished",
    "Most Abandoned",
    "Fan Favourite",
    "Hidden Gem",
    "Director Spotlight",
    "Actor Spotlight",
    "Most Anticipated",
  ];

  useEffect(() => {
    GetTrends();
  }, [selectedTrendTimeFrame]);

  async function GetTrends() {
    setIsTrendsLoading(true);
    if (
      trends.filter((item) => item.timeframe === selectedTrendTimeFrame)
        .length === 0
    ) {
      var trendData = await GetMediaTrends(selectedTrendTimeFrame);
      setTrends([...trends, ...trendData]);
    }
    setIsTrendsLoading(false);
  }

  function filterByAward(items: MediaTrendModel[]): MediaTrendModel[] {
    if (selectedTrendFilters.length === 0) return items;
    return items.filter((item) =>
      selectedTrendFilters.includes(item.awardType)
    );
  }

  return (
    <div className="leaderboards-container">
      <div className="leaderboards">
        <TopBar whiteText />
        <div className="header">
          <h1>Leaderboards</h1>
        </div>
        <div className="content">
          <div className="sub-header">
            <h2>Global Review Rankings</h2>
            <div className="actions">
              <FormControl
                disabled={isRankingsLoading}
                variant="outlined"
                sx={{ minWidth: 225, width: 400 }}
              >
                <InputLabel>Time Frame</InputLabel>
                <Select
                  label="Time Frame"
                  value={selectedRankingTimeFrame}
                  onChange={(e) => setSelectedRankingTimeFrame(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltOutlinedIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="all-time">All Time</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          {isRankingsLoading ? (
            <div className="rankings">
              <Loader />
            </div>
          ) : (
            <div className="rankings">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings?.length !== 0 ? (
                    rankings
                      ?.filter(
                        (item) => item.timeframe === selectedRankingTimeFrame
                      )
                      .map((ranking) => {
                        return (
                          <tr key={ranking.rank}>
                            <td>{ranking.rank}</td>
                            <td>{ranking.name}</td>
                            <td>{ranking.reviews}</td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={4}>No Other Rankings</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="sub-header">
            <h2>Media Trends</h2>
            <div className="actions">
              <FormControl
                variant="outlined"
                sx={{ minWidth: 225, width: 400 }}
              >
                <InputLabel>Time Frame</InputLabel>
                <Select
                  label="Time Frame"
                  value={selectedTrendTimeFrame}
                  onChange={(e) => setSelectedTrendTimeFrame(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltOutlinedIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                fullWidth
                autoComplete
                disableCloseOnSelect
                limitTags={1}
                options={awards}
                getOptionLabel={(award) => award}
                value={selectedTrendFilters}
                onChange={(_e, values) => setSelectedTrendFilters(values)}
                sx={{ minWidth: 225, width: 500 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Award Type"
                    placeholder="Add Award..."
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <FilterAltOutlinedIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
                renderOption={(props, award) => {
                  const { key, ...awardProps } = props;
                  return (
                    <Box key={award} component="li" {...awardProps}>
                      <Checkbox
                        checked={selectedTrendFilters.includes(award)}
                      />
                      {award}
                    </Box>
                  );
                }}
              />
            </div>
          </div>
          {isTrendsLoading ? (
            <div className="trends">
              <Loader />
            </div>
          ) : (
            <div className="trends">
              <div className="trends-list">
                {filterByAward(
                  trends.filter(
                    (trend) => trend.timeframe === selectedTrendTimeFrame
                  )
                ).map((trend) => {
                  return (
                    <div
                      key={trend.title + trend.awardType}
                      className="trend-item"
                    >
                      <h3>
                        {trend.awardType}: <span>{trend.title}</span>
                      </h3>
                      <p>{trend.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardsPage;
