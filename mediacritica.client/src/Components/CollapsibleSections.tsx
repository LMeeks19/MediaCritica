import { FC, useEffect, useState } from "react";
import "./CollapsibleSections.scss";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import GradeIcon from "@mui/icons-material/Grade";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardHeader,
  Divider,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MediaSummaryModelResponse } from "../Interfaces/MediaSummaryModelResponse";
import Loader from "./Loader";
import ScrollContainer from "react-indiana-drag-scroll";
import { MediaType } from "../Enums/MediaType";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";

interface SectionProps {
  title: string;
  request: Function;
  defaultIsOpen: boolean;
}

const MediaGrid: FC<{
  media: MediaSummaryModelResponse;
  filter: string;
  isLoading: boolean;
}> = ({ media, filter, isLoading }) => {
  const navigate = useNavigate();

  function filtered(items: MediaSummaryModel[]) {
    if (filter === "all") return items;
    return items.filter((item) => item.type === filter);
  }

  return (
    <ScrollContainer className="media-container">
      {isLoading || filtered(media.mediaSummaryModels).length === 0 ? (
        <div className="w-full flex items-center justify-center h-[225px]">
          {isLoading ? <Loader /> : "No Media"}
        </div>
      ) : (
        filtered(media.mediaSummaryModels).map((item) => (
          <Card
            key={item.id}
            style={{
              backgroundImage: `url(${item.poster?.replace(
                "300.jpg",
                "180.jpg"
              )})`,
            }}
          >
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
              <CardMedia />
              <CardHeader title={item.title} />
              <Divider />
              <CardContent>
                <Typography>{item.genre}</Typography>
                <Typography>{format(item.released, "do MMMM yyyy")}</Typography>
                <div className="flex justify-around">
                  <Typography>{CapitaliseFirstLetter(item.type)}</Typography>
                  {item.imdbRating !== null && (
                    <Typography
                      component="div"
                      className="flex items-center gap-1"
                    >
                      <GradeIcon
                        style={{ fontSize: 14, color: "var(--rating-star)" }}
                      />
                      <div className="">{item.imdbRating}</div>
                    </Typography>
                  )}
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        ))
      )}
    </ScrollContainer>
  );
};

export const CollapsibleSection: FC<SectionProps> = ({
  title,
  request,
  defaultIsOpen,
}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const [media, setMedia] = useState<MediaSummaryModelResponse>({
    mediaSummaryModels: [],
    totalMediaCount: -1,
  } as MediaSummaryModelResponse);
  const [isLaoding, setIsLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    GetMedia();
  }, [isOpen]);

  async function GetMedia() {
    if (
      isOpen &&
      media.mediaSummaryModels.length === 0 &&
      media.mediaSummaryModels.length !== media.totalMediaCount
    ) {
      setIsLoading(true);
      setMedia(await request());
    }
    setIsLoading(false);
  }

  return (
    <section className="section">
      <div
        className="sub-header collapsible"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2>{title}</h2>
        <div className="actions">
          {isOpen ? <RemoveIcon /> : <AddIcon />}
          <ToggleButtonGroup
            value={selectedFilter}
            onChange={(e, v) => {
              e.stopPropagation();
              setSelectedFilter(v);
            }}
            exclusive
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value={MediaType.Movie}>Movies</ToggleButton>
            <ToggleButton value={MediaType.Series}>Series</ToggleButton>
            <ToggleButton value={MediaType.Game}>Games</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      {isOpen && (
        <MediaGrid
          media={media}
          isLoading={isLaoding}
          filter={selectedFilter}
        />
      )}
    </section>
  );
};

export const CollapsibleTabSection: FC<{
  title: string;
  tabs: { label: string; request: Function }[];
  defaultIsOpen: boolean;
}> = ({ title, tabs, defaultIsOpen }) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);
  const [activeTab, setActiveTab] = useState(0);
  const [tab1Media, setTab1Media] = useState<MediaSummaryModelResponse>({
    mediaSummaryModels: [],
    totalMediaCount: -1,
  } as MediaSummaryModelResponse);
  const [tab2Media, setTab2Media] = useState<MediaSummaryModelResponse>({
    mediaSummaryModels: [],
    totalMediaCount: -1,
  } as MediaSummaryModelResponse);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    GetMedia();
  }, [isOpen, activeTab]);

  async function GetMedia() {
    if (isOpen) {
      setIsLoading(true);
      if (
        activeTab === 0 &&
        tab1Media.mediaSummaryModels.length === 0 &&
        tab1Media.mediaSummaryModels.length !== tab1Media.totalMediaCount
      )
        setTab1Media(await tabs[0].request());

      if (
        activeTab === 1 &&
        tab2Media.mediaSummaryModels.length === 0 &&
        tab2Media.mediaSummaryModels.length !== tab2Media.totalMediaCount
      )
        setTab2Media(await tabs[1].request());
    }
    setIsLoading(false);
  }

  return (
    <section className="section">
      <div
        className="sub-header collapsible"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2>{title}</h2>
        <div className="actions">
          {isOpen ? <RemoveIcon /> : <AddIcon />}
          <ToggleButtonGroup
            value={selectedFilter}
            onChange={(e, v) => {
              e.stopPropagation();
              setSelectedFilter(v);
            }}
            exclusive
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value={MediaType.Movie}>Movies</ToggleButton>
            <ToggleButton value={MediaType.Series}>Series</ToggleButton>
            <ToggleButton value={MediaType.Game}>Games</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      {isOpen && (
        <div className="tab-section">
          <div className="tabs">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`tab ${activeTab === index ? "active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </div>
            ))}
          </div>
          <div tabIndex={0} hidden={activeTab !== 0}>
            <MediaGrid
              media={tab1Media}
              isLoading={isLoading}
              filter={selectedFilter}
            />
          </div>
          <div tabIndex={1} hidden={activeTab !== 1}>
            <MediaGrid
              media={tab2Media}
              isLoading={isLoading}
              filter={selectedFilter}
            />
          </div>
        </div>
      )}
    </section>
  );
};
