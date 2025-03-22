import "./CommentsDialog.scss";
import { Dialog, DialogContent, DialogTitle, Fab } from "@mui/material";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { CommentsContainer } from "./Comments";
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
import Loader from "./Loader";

function CommentsDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  reviewId: number;
}) {
  const [comments, setComments] = useState<Comment[]>([] as Comment[]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function FetchComments() {
      if (props.open) {
        setIsLoading(true);
        const commentsData = await GetReviewComments(props.reviewId);
        setComments(commentsData);
        setIsLoading(false);
      }
    }
    FetchComments();
  }, [props.open]);

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
      comment: comment,
      commenterId: user.id,
      commenterName: `${user.forename} ${user.surname}`,
      children: [],
      totalChildren: 0,
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
      onClose={() => props.setOpen(false)}
    >
      <DialogTitle>
        Comments
        <Fab onClick={() => props.setOpen(false)}>
          <CloseIcon />
        </Fab>
      </DialogTitle>
      {isLoading ? (
        <DialogContent>
          <Loader />
        </DialogContent>
      ) : (
        <DialogContent sx={{ padding: "2rem !important" }}>
          <div className="flex items-center mb-[5px]">
            Actions
            <div className="flex gap-2 ml-auto">
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
              value={JSON.parse(comment) as DeltaStatic}
              onChange={(_V, _D, _S, e) =>
                setComment(JSON.stringify(e.getContents()))
              }
              placeholder="Enter Comment"
              modules={modules}
            />
          )}
          <CommentsContainer comments={comments} reviewId={props.reviewId} />
        </DialogContent>
      )}
    </Dialog>
  );
}

export default CommentsDialog;
