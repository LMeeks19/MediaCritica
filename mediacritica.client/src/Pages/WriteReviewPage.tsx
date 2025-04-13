import "./WriteReviewPage.scss";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userState } from "../State/GlobalState";
import { useRecoilState } from "recoil";
import TopBar from "../Components/TopBar";
import { Button, ButtonGroup, Rating } from "@mui/material";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { PostReview } from "../Server/Server";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import Loader from "../Components/Loader";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAltOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { MediaType } from "../Enums/MediaType";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CustomTooltip } from "../Components/Tooltip";
import { DeltaStatic } from "quill";

function WriteReviewPage() {
  const [user, setUser] = useRecoilState(userState);
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>(JSON.stringify(""));
  const [rating, setRating] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const quillRef = useRef<ReactQuill>(null);

  const media = location.state?.media as
    | MovieModel
    | SeriesModel
    | EpisodeModel;

  useEffect(() => {
    if (user.id === undefined) navigate("/login");
    if (media === undefined) navigate("/");
    setIsLoading(false);
  });

  const postReviewDialog = {
    title: "Post review?",
    dialog: "This will post everything written in this review",
    cancel_text: "Keep Writing",
    cancel_icon: <EditOutlinedIcon />,
    confirm_text: "Post",
    confirm_icon: <PostAddIcon />,
    confirm_action: () => SubmitReview(),
  } as ConfirmationDialogModel;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function SubmitReview() {
    setIsLoading(true);
    const review = {
      mediaId: media.id,
      mediaPoster: media.poster,
      mediaTitle: media.title,
      mediaSeriesTitle: (media as EpisodeModel).seriesTitle,
      mediaType: media.type,
      reviewerId: user.id,
      reviewerUsername: user.username,
      title: title,
      rating: rating,
      description: description,
      date: new Date(),
    } as ReviewModel;

    const reviewId = await PostReview(review);
    setUser({ ...user, totalReviews: user.totalReviews + 1 });
    navigate(`/${media.type}/${media.id}/reviews/${reviewId}`);
    setIsLoading(false);
  }

  function ResetFields() {
    setTitle("");
    setDescription("");
    setRating(0);
  }

  function getHeaderSubTitle() {
    var episode = media as EpisodeModel;
    return `${episode.title} - S${episode.season}:E${episode.episode}`;
  }

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: ["", "center", "right", "justify"] }],
      ["link"],
    ],
  };

  return (
    user.id !== undefined && (
      <div className="writereviewpage-container">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="review">
            <TopBar />
            <div className="info">
              <div className="hero">
                <div className="parent-title">
                  {(media as EpisodeModel).seriesTitle ?? media.title}
                  {media.type === MediaType.Episode && (
                    <div className="sub-title">{getHeaderSubTitle()}</div>
                  )}
                </div>
                <ButtonGroup>
                  <Button type="reset" onClick={() => ResetFields()}>
                    <CustomTooltip title="Reset">
                      <RestartAltIcon />
                    </CustomTooltip>
                  </Button>
                  <Button
                    form="review-form"
                    type="submit"
                    disabled={description === "" || title == ""}
                  >
                    <CustomTooltip title="Post">
                      <PostAddIcon />
                    </CustomTooltip>
                  </Button>
                </ButtonGroup>
              </div>
              <form
                id="review-form"
                className="review-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(true);
                }}
              >
                <div className="title-section">
                  <input
                    className="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    placeholder="Enter title..."
                    maxLength={50}
                    required
                  />
                  <Rating
                    value={rating}
                    precision={0.5}
                    sx={{ fontSize: "2.5rem" }}
                    onChange={(_event, value) => setRating(value)}
                  />
                </div>
                <div className="flex flex-col w-full h-full overflow-hidden">
                  <ReactQuill
                    ref={quillRef}
                    className="review-description"
                    placeholder="Enter review..."
                    value={JSON.parse(description) as DeltaStatic}
                    onChange={(_v, _d, _s, editor) => {
                      const textLength = editor.getLength() - 1;
                      const quill = quillRef.current?.getEditor();
                      if (textLength <= 2000) {
                        setDescription(JSON.stringify(editor.getContents()));
                        setCharacterCount(textLength);
                      } else if (quill) {
                        quill.deleteText(2000, textLength - 2000); // Remove extra characters
                      }
                    }}
                    modules={modules}
                  />
                  <div className="character-count">{characterCount}/2000</div>
                </div>
              </form>
            </div>
            {media.poster !== "N/A" ? (
              <div
                className="media-poster"
                style={{
                  backgroundImage: `url(${media.poster.replace(
                    "300.jpg",
                    "752.jpg"
                  )})`,
                }}
              />
            ) : (
              <div className="media-poster empty">
                <ImageIcon />
              </div>
            )}
          </div>
        )}
        <ConfirmationDialog
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          data={postReviewDialog}
        />
      </div>
    )
  );
}

export default WriteReviewPage;
