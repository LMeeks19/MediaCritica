import { Button, ButtonGroup } from "@mui/material";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import { CustomTooltip } from "./Tooltip";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { useEffect, useState } from "react";
import {
  DeleteBacklog,
  GetUserMediaBackloggedStatus,
  GetUserReviewStatus,
  PostBacklog,
} from "../Server/Server";
import ReviewIcon from "@mui/icons-material/PostAdd";
import { GameModel } from "../Interfaces/GameModel";
import { MediaType } from "../Enums/MediaType";
import { BacklogModel } from "../Interfaces/BacklogModel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";

function MediaActions(props: {
  media: MovieModel | SeriesModel | GameModel | EpisodeModel;
}) {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);
  const [userBacklogStatus, setUserBacklogStatus] = useState<boolean>(false);

  useEffect(() => {
    async function FetchUserActionStatus() {
      if (props.media.type !== MediaType.Episode) {
        const backlogStatus = await GetUserMediaBackloggedStatus(
          props.media.id!,
          user.id
        );
        setUserBacklogStatus(backlogStatus.value);
      }
      if (user.id !== undefined) {
        const reviewStatus = await GetUserReviewStatus(props.media.id, user.id);
        setHasUserReviewed(reviewStatus.value);
      }
    }
    FetchUserActionStatus();
  }, []);

  async function AddToBacklog() {
    const backlog = {
      userId: user.id,
      mediaId: props.media.id,
      mediaType: props.media.type,
      mediaPoster: props.media.poster,
      mediaTitle: props.media.title,
      addedDate: new Date(),
    } as BacklogModel;

    await PostBacklog(backlog).then(() => {
      setUserBacklogStatus(true);
      setUser({
        ...user,
        totalBacklogs: user.totalBacklogs + 1,
      });
    });
  }

  async function RemoveFromBacklog() {
    await DeleteBacklog(props.media.id, user.id).then(() => {
      setUserBacklogStatus(false);
      setUser({
        ...user,
        totalBacklogs: user.totalBacklogs - 1,
      });
    });
  }

  return (
    <ButtonGroup>
      {props.media.type !== MediaType.Episode &&
        (userBacklogStatus ? (
          <CustomTooltip title="Remove from backlog">
            <Button onClick={() => RemoveFromBacklog()}>
              <FavoriteIcon />
            </Button>
          </CustomTooltip>
        ) : (
          <CustomTooltip
            title={
              user.id === undefined
                ? "Login to update backlog status"
                : "Add to backlog"
            }
          >
            <Button
              disabled={user.id === undefined}
              onClick={() => AddToBacklog()}
            >
              <FavoriteBorderIcon />
            </Button>
          </CustomTooltip>
        ))}
      <CustomTooltip
        title={
          user.id !== undefined
            ? hasUserReviewed
              ? "Already reviewed"
              : new Date(props.media.released).getTime() > new Date().getTime()
              ? `${CapitaliseFirstLetter(props.media.type)} not out yet`
              : "Write a review"
            : "Login to review"
        }
      >
        <Button
          onClick={() =>
            navigate(`/${props.media.type}/${props.media.id}/reviews/write`, {
              state: { media: props.media },
            })
          }
          disabled={
            user.id === undefined ||
            hasUserReviewed ||
            new Date(props.media.released).getTime() > new Date().getTime()
          }
        >
          <ReviewIcon />
        </Button>
      </CustomTooltip>
    </ButtonGroup>
  );
}

export default MediaActions;
