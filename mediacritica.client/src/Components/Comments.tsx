import "./Comments.scss";
import { formatDistanceToNowStrict } from "date-fns";
import ReplyIcon from "@mui/icons-material/MapsUgcOutlined";
import FlagIcon from "@mui/icons-material/FlagOutlined";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import LoadMoreIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import { CustomTooltip } from "./Tooltip";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import {
  DeleteComment,
  GetCommentsRemainingChildren,
  PostComment,
  UpdateComment,
} from "../Server/Server";
import { useState } from "react";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
import { CommentModel } from "../Interfaces/CommentModel";

export function Comment({
  comment,
  reviewId,
}: {
  comment: CommentModel;
  reviewId: number;
}) {
  const user = useRecoilValue(userState);
  const [curComment, setCurComment] = useState<CommentModel>(comment);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [reply, setReply] = useState<string>("{}");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState<string>(
    curComment.content!
  );

  const canLoadMore = curComment.totalReplies - curComment.replies.length > 0;
  const unloadedReplies = curComment.totalReplies - curComment.replies.length;

  async function getRemainingChildren() {
    const offset = curComment.totalReplies - unloadedReplies;
    const commentData = await GetCommentsRemainingChildren(comment.id, offset);
    setCurComment({
      ...curComment,
      replies: [...curComment.replies, ...commentData],
    });
  }

  async function deleteComment() {
    await DeleteComment(comment.id).then(() =>
      setCurComment({
        ...curComment,
        content: undefined,
        commenterId: undefined,
        commenterName: undefined,
        commentedAt: undefined,
        isDeleted: true,
      })
    );
  }

  async function sendReply() {
    const newComment = {
      reviewId: reviewId,
      parentId: comment.id,
      comment: reply,
      commenterId: user.id,
      commenterName: `${user.forename} ${user.surname}`,
      replies: [],
      totalReplies: 0,
    };

    await PostComment(newComment)
      .then((data) =>
        setCurComment({
          ...curComment,
          replies: [data, ...curComment.replies],
        })
      )
      .then(() => setReply("{}"))
      .then(() => setIsReplying(false));
  }

  async function saveComment() {
    await UpdateComment({
      id: curComment.id,
      content: editedComment!,
    })
      .then(() =>
        setCurComment({ ...curComment, commentedAt: new Date().toUTCString() })
      )
      .then(() => setIsEditing(false));
  }

  function resetEdit() {
    setEditedComment(curComment.content!);
    setIsEditing(false);
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
    <div className={`comment ${user.id === curComment.commenterId && "mine"}`}>
      <div className="details">
        <AccountIcon fontSize="small" />{" "}
        {curComment.isDeleted
          ? "deleted"
          : `${curComment.commenterName} - ${formatDistanceToNowStrict(
              curComment.commentedAt!
            )} ago`}
        <div className="flex gap-2 ml-auto">
          {user.id === curComment.commenterId && !isEditing && (
            <CustomTooltip title="Edit">
              <EditIcon
                className="icon"
                fontSize="small"
                onClick={() => setIsEditing(true)}
              />
            </CustomTooltip>
          )}
          {user.id === curComment.commenterId && !isEditing && (
            <CustomTooltip title="Delete">
              <DeleteIcon
                className="icon"
                fontSize="small"
                onClick={() => deleteComment()}
              />
            </CustomTooltip>
          )}
          {user.id === curComment.commenterId && isEditing && (
            <CustomTooltip title="Cancel">
              <CancelIcon
                className="icon"
                fontSize="small"
                onClick={() => resetEdit()}
              />
            </CustomTooltip>
          )}
          {user.id === curComment.commenterId && isEditing && (
            <CustomTooltip title="Save">
              <SaveIcon
                className="icon"
                fontSize="small"
                onClick={() => saveComment()}
              />
            </CustomTooltip>
          )}
        </div>
      </div>
      <div
        className={`content ${
          curComment.isDeleted && curComment.replies.length === 0 && "blank"
        } ${user.id === curComment.commenterId && "mine"}`}
      >
        {curComment.content && (
          <ReactQuill
            className={`message ${!isEditing && "readonly"}`}
            modules={modules}
            value={JSON.parse(editedComment) as DeltaStatic}
            onChange={(_v, _d, _s, e) =>
              setEditedComment(JSON.stringify(e.getContents()))
            }
            readOnly={!isEditing}
          />
        )}
        {!curComment.isDeleted && (
          <div
            className={`actions ${curComment.replies.length === 0 && "blank"}`}
          >
            {user.id !== curComment.commenterId && user.id !== undefined && (
              <CustomTooltip title="Report">
                <FlagIcon className="icon" />
              </CustomTooltip>
            )}
            {isReplying ? (
              <CustomTooltip
                title="Cancel"
                onClick={() => setIsReplying(false)}
              >
                <CancelIcon className="icon" />
              </CustomTooltip>
            ) : (
              <CustomTooltip title="Reply" onClick={() => setIsReplying(true)}>
                <ReplyIcon className="icon" />
              </CustomTooltip>
            )}
            {isReplying && (
              <CustomTooltip title="Send" onClick={() => sendReply()}>
                <SendIcon className="icon" />
              </CustomTooltip>
            )}
          </div>
        )}
        {isReplying && (
          <ReactQuill
            className="reply"
            placeholder="Enter reply..."
            value={JSON.parse(reply) as DeltaStatic}
            onChange={(_v, _d, _S, e) =>
              setReply(JSON.stringify(e.getContents()))
            }
            modules={modules}
          />
        )}
        {curComment.replies.length > 0 &&
          curComment.replies.map((comment) => (
            <Comment key={comment.id} comment={comment} reviewId={reviewId} />
          ))}
        {canLoadMore && (
          <div className="load" onClick={() => getRemainingChildren()}>
            <LoadMoreIcon fontSize="small" /> {unloadedReplies} more replies
          </div>
        )}
      </div>
    </div>
  );
}
