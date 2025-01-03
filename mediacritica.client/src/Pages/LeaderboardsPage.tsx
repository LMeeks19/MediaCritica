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
import { UserRankingModelObject } from "../Interfaces/UserRankingModel";
import { GetUserRankings } from "../Server/Server";

function LeaderboardsPage() {
  const [rankings, setRankings] = useState<UserRankingModelObject>(
    {} as UserRankingModelObject
  );
  const [selectedTrendFilters, setSelectedTrendFilters] = useState<string[]>(
    []
  );
  const [selectedTrendTimeFrame, setSelectedTrendTimeFrame] =
    useState<string>("week");
  const [selectedRankingTimeFrame, setSelectedRankingTimeFrame] =
    useState<string>("week");

  const awards = [
    "Rising",
    "Falling",
    "Surprise",
    "Most Reviewed",
    "Highest Rated",
    "Genre Standout",
    "Comeback",
  ];

  useEffect(() => {
    GetRankings();
  }, [selectedRankingTimeFrame]);

  async function GetRankings() {
    var rankingData = await GetUserRankings(selectedRankingTimeFrame);
    setRankings({
      first: rankingData.at(0)!,
      second: rankingData.at(1)!,
      third: rankingData.at(2)!,
      other: rankingData.slice(3, rankingData.length),
    });
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
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="rankings">
            <div className="podium">
              {rankings.first && (
                <div className="podium-place gold">
                  <div className="podium-rank gold">{rankings.first?.rank}</div>
                  <h3>{rankings.first?.name}</h3>
                  <p>{rankings.first?.reviews} Reviews</p>
                </div>
              )}
              {rankings.second && (
                <div className="podium-place silver">
                  <div className="podium-rank silver">
                    {rankings.second?.rank}
                  </div>
                  <h3>{rankings.second?.name}</h3>
                  <p>{rankings.second?.reviews} Reviews</p>
                </div>
              )}
              {rankings.third && (
                <div className="podium-place bronze">
                  <div className="podium-rank bronze">
                    {rankings.third?.rank}
                  </div>
                  <h3>{rankings.third?.name}</h3>
                  <p>{rankings.third?.reviews} Reviews</p>
                </div>
              )}
            </div>

            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {rankings.other?.length !== 0 ? (
                  rankings.other?.map((ranking) => {
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
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                fullWidth
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
          <div className="trends">
            <div className="trends-list">
              <div className="trend-item">
                <h3>
                  Rising Star: <span>Interstellar</span>
                </h3>
                <p>50 new reviews this week!</p>
              </div>
              <div className="trend-item">
                <h3>
                  Falling Star: <span>Matrix Resurrections</span>
                </h3>
                <p>10% decrease in interest.</p>
              </div>
              <div className="trend-item">
                <h3>
                  Surprise Hit: <span>Parasite</span>
                </h3>
                <p>Rated 9.8 on average this month!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardsPage;
