import "./HomeAccordion.scss";
import { FC, useEffect, useState } from "react";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MediaSummaryModelResponse } from "../Interfaces/MediaSummaryModelResponse";
import Loader from "./Loader";
import ScrollContainer from "react-indiana-drag-scroll";
import { MediaType } from "../Enums/MediaType";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";

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
          <Card key={item.id}>
            <img
              className="image"
              src={item.poster?.replace("300.jpg", "180.jpg")}
              alt={item.title}
            />
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

export const BaseAccordion: FC<SectionProps> = ({
  title,
  request,
  defaultIsOpen,
}) => {
  const [media, setMedia] = useState<MediaSummaryModelResponse>({
    mediaSummaryModels: [],
    totalMediaCount: -1,
  } as MediaSummaryModelResponse);
  const [isLaoding, setIsLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    GetMedia(defaultIsOpen);
  }, []);

  async function GetMedia(isOpen: boolean) {
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
    <Accordion
      className="section"
      disableGutters
      defaultExpanded={defaultIsOpen}
      onChange={(_e, v: boolean) => GetMedia(v)}
    >
      <AccordionSummary
        className="sub-header collapsible"
        expandIcon={<ArrowDropDownIcon />}
      >
        <h2>{title}</h2>
        <div className="actions">
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
      </AccordionSummary>
      <AccordionDetails>
        <MediaGrid
          media={media}
          isLoading={isLaoding}
          filter={selectedFilter}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const TabbedAccordion: FC<{
  title: string;
  tabs: { label: string; request: Function }[];
  defaultIsOpen: boolean;
}> = ({ title, tabs, defaultIsOpen }) => {
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
    GetMedia(defaultIsOpen, activeTab);
  }, []);

  async function GetMedia(isOpen: boolean, selectedTab: number) {
    setActiveTab(selectedTab);
    if (isOpen) {
      setIsLoading(true);
      if (
        selectedTab === 0 &&
        tab1Media.mediaSummaryModels.length === 0 &&
        tab1Media.mediaSummaryModels.length !== tab1Media.totalMediaCount
      )
        setTab1Media(await tabs[0].request());

      if (
        selectedTab === 1 &&
        tab2Media.mediaSummaryModels.length === 0 &&
        tab2Media.mediaSummaryModels.length !== tab2Media.totalMediaCount
      )
        setTab2Media(await tabs[1].request());
    }
    setIsLoading(false);
  }

  return (
    <Accordion
      className="section"
      disableGutters
      defaultExpanded={defaultIsOpen}
      onChange={(_e, v: boolean) => GetMedia(v, activeTab)}
    >
      <AccordionSummary
        className="sub-header collapsible"
        expandIcon={<ArrowDropDownIcon />}
      >
        <h2>{title}</h2>
        <div className="actions">
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
      </AccordionSummary>
      <AccordionDetails className="tab-section">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab ${activeTab === index && "active"}`}
              onClick={async () => {
                await GetMedia(true, index);
              }}
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
      </AccordionDetails>
    </Accordion>
  );
};
