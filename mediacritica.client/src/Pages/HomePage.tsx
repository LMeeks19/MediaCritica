import "./HomePage.scss";
import TopBar from "../Components/TopBar";
import { BaseAccordion, TabbedAccordion } from "../Components/HomeAccordion";
import {
  GetBestOfAllTime,
  GetBestOfCurYear,
  GetBestOfPrevYear,
  GetLatest,
  GetMostReviewed,
  GetRecentlyReviewed,
  GetSeasonalPicks,
  GetUpcoming,
} from "../Server/Server";

function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="homepage-container">
      <div className="homepage">
        <TopBar hideBack />
        <div className="sections">
          <BaseAccordion
            title="Seasonal Picks"
            request={() => GetSeasonalPicks()}
            defaultIsOpen={true}
          />

          <TabbedAccordion
            title="New & Upcoming"
            tabs={[
              {
                label: "Latest Releases",
                request: () => GetLatest(),
              },
              {
                label: "Upcoming Releases",
                request: () => GetUpcoming(),
              },
            ]}
            defaultIsOpen={true}
          />

          <TabbedAccordion
            title="Yearly Highlights"
            tabs={[
              {
                label: `Best of ${currentYear - 1}`,
                request: () => GetBestOfPrevYear(),
              },
              {
                label: `Best of ${currentYear} (So Far)`,
                request: () => GetBestOfCurYear(),
              },
            ]}
            defaultIsOpen={false}
          />

          <TabbedAccordion
            title="Community Highlights"
            tabs={[
              {
                label: "Recently Reviewed",
                request: () => GetRecentlyReviewed(),
              },
              {
                label: "Most Reviewed",
                request: () => GetMostReviewed(),
              },
            ]}
            defaultIsOpen={false}
          />

          <BaseAccordion
            title="Best of All Time"
            request={() => GetBestOfAllTime()}
            defaultIsOpen={false}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
