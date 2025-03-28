import "./CommentsDialog.scss";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
} from "@mui/material";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import CloseIcon from "@mui/icons-material/Close";
import { Comment } from "./Comments";
import { useEffect, useState } from "react";
import { GetReviewComments, PostComment } from "../Server/Server";
import ReactQuill from "react-quill";
import { userState } from "../State/GlobalState";
import { CustomTooltip } from "./Tooltip";
import { DeltaStatic } from "quill";
import ReplyIcon from "@mui/icons-material/MapsUgcOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";
import RefreshIcon from "@mui/icons-material/CachedOutlined";
import Loader from "./Loader";
import { CommentModel } from "../Interfaces/CommentModel";

function CommentsDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  reviewId: number;
}) {
  const [comments, setComments] = useState<CommentModel[]>(
    [] as CommentModel[]
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    FetchComments();
  }, [props.open]);

  async function FetchComments() {
    if (props.open) {
      setIsLoading(true);
      const commentsData = await GetReviewComments(props.reviewId);
      setComments(commentsData);
      setIsLoading(false);
    }
  }

  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("{}");
  const user = useRecoilValue(userState);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: ["", "center", "right", "justify"] }],
      ["link"],
    ],
  };

  async function sendComment() {
    const newComment = {
      reviewId: props.reviewId,
      parentId: null,
      content: comment,
      commenterId: user.id,
      commenterName: `${user.forename} ${user.surname}`,
      replies: [],
      totalReplies: 0,
    };

    await PostComment(newComment)
      .then((data) => setComments([data, ...comments]))
      .then(() => setIsCommenting(false));
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      scroll="paper"
      slotProps={{
        paper: {
          style: { height: "100%" },
        },
      }}
      open={props.open}
      onClose={() => {
        setIsCommenting(false);
        props.setOpen(false);
      }}
    >
      <DialogTitle>
        Comments ({comments.length})
        <Fab
          onClick={() => {
            setIsCommenting(false);
            props.setOpen(false);
          }}
        >
          <CloseIcon />
        </Fab>
      </DialogTitle>
      {isLoading ? (
        <DialogContent>
          <Loader />
        </DialogContent>
      ) : (
        <DialogContent className="comments-dialog">
          <div className="flex items-center mx-[10px]">
            Actions
            <div className="flex gap-3 ml-auto">
              <CustomTooltip title="Refresh">
                <RefreshIcon className="icon" onClick={() => FetchComments()} />
              </CustomTooltip>
              {!isCommenting && (
                <CustomTooltip title="Comment">
                  <ReplyIcon
                    className="icon"
                    onClick={() => setIsCommenting(true)}
                  />
                </CustomTooltip>
              )}
              {isCommenting && (
                <CustomTooltip title="Cancel">
                  <CancelIcon
                    className="icon"
                    onClick={() => setIsCommenting(false)}
                  />
                </CustomTooltip>
              )}
              {isCommenting && (
                <CustomTooltip title="Send">
                  <SendIcon className="icon" onClick={() => sendComment()} />
                </CustomTooltip>
              )}
            </div>
          </div>
          {isCommenting && (
            <ReactQuill
              className="mx-[10px]"
              value={JSON.parse(comment) as DeltaStatic}
              onChange={(_V, _D, _S, e) =>
                setComment(JSON.stringify(e.getContents()))
              }
              placeholder="Enter Comment"
              modules={modules}
            />
          )}
          <Divider
            component="div"
            sx={{ borderColor: "gray !important", margin: "0 10px" }}
          />
          {comments.length === 0 ? (
            <div className="empty flex-1">No Comments</div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                reviewId={props.reviewId}
              />
            ))
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}

export default CommentsDialog;
