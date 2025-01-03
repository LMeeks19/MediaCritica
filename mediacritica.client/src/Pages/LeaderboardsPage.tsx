import TopBar from "../Components/TopBar";
import "./LeaderboardsPage.scss";

function LeaderboardsPage() {
  return (
    <div className="leaderboards-container">
      <div className="leaderboards">
        <TopBar whiteText />
        <div className="header">
          <h1>Leaderboards</h1>
        </div>
        <div className="content">
          <div className="sub-header">
            <h2>Global Rankings</h2>
          </div>
          <div className="rankings">
            <div className="podium">
              <div className="podium-place gold">
                <div className="podium-rank gold">1</div>
                <h3>CriticKing</h3>
                <p>145 Reviews</p>
                <p>980 Likes</p>
              </div>
              <div className="podium-place silver">
                <div className="podium-rank silver">2</div>
                <h3>MediaGuru</h3>
                <p>130 Reviews</p>
                <p>860 Likes</p>
              </div>
              <div className="podium-place bronze">
                <div className="podium-rank bronze">3</div>
                <h3>FilmFanatic</h3>
                <p>120 Reviews</p>
                <p>750 Likes</p>
              </div>
            </div>

            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Reviews</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4</td>
                  <td>ReviewMaster</td>
                  <td>110</td>
                  <td>680</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>MovieBuff99</td>
                  <td>95</td>
                  <td>620</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>CinemaLover</td>
                  <td>90</td>
                  <td>590</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>CinemaLover</td>
                  <td>90</td>
                  <td>590</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>CinemaLover</td>
                  <td>90</td>
                  <td>590</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>CinemaLover</td>
                  <td>90</td>
                  <td>590</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>CinemaLover</td>
                  <td>90</td>
                  <td>590</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="sub-header">
            <h2>Media Trends</h2>
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
