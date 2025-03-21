import "./Comments.scss";
import { formatDistanceToNowStrict } from "date-fns";
import ReplyIcon from "@mui/icons-material/MapsUgcOutlined";
import FlagIcon from "@mui/icons-material/FlagOutlined";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import LikeIcon from "@mui/icons-material/ThumbUpAltOutlined";
import DislikeIcon from "@mui/icons-material/ThumbDownAltOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import LoadMoreIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import { CustomTooltip } from "./Tooltip";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";

interface CommentType {
  id: number;
  message: string;
  commenterName: string;
  commenterId: number;
  commentedAt: string;
  children: CommentType[];
  totalChildren: number;
}

// Comment component
export function Comment({ comment }: { comment: CommentType }) {
  const user = useRecoilValue(userState);

  const canLoadMore = comment.totalChildren - comment.children.length > 0;

  return (
    <div className="comment">
      <div className="details">
        <AccountIcon fontSize="small" /> {comment.commenterName} -{" "}
        {formatDistanceToNowStrict(comment.commentedAt)} ago
      </div>
      <div className={`content ${!canLoadMore && "blank"}`}>
        <div className={`message ${user.id === comment.commenterId && "mine"}`}>
          {comment.message}
        </div>
        <div
          className={`actions ${user.id === comment.commenterId && "mine"} ${
            comment.children.length === 0 && "blank"
          }`}
        >
          <CustomTooltip title="Reply">
            <ReplyIcon className="icon" fontSize="small" />
          </CustomTooltip>
          <CustomTooltip title="Report">
            <FlagIcon className="icon" fontSize="small" />
          </CustomTooltip>
          <CustomTooltip title="Share">
            <ShareIcon className="icon" fontSize="small" />
          </CustomTooltip>
          {user.id !== comment.commenterId && user.id !== undefined && (
            <CustomTooltip title="Like">
              <LikeIcon className="icon" fontSize="small" />
            </CustomTooltip>
          )}
          {user.id !== comment.commenterId && user.id !== undefined && (
            <CustomTooltip title="Dislike">
              <DislikeIcon className="icon" fontSize="small" />
            </CustomTooltip>
          )}
          {user.id === comment.commenterId && (
            <CustomTooltip title="Edit">
              <EditIcon className="icon" fontSize="small" />
            </CustomTooltip>
          )}
          {user.id === comment.commenterId && (
            <CustomTooltip title="Delete">
              <DeleteIcon className="icon" fontSize="small" />
            </CustomTooltip>
          )}
        </div>
        {comment.children.length > 0 && (
          <CommentsContainer comments={comment.children} />
        )}
        {canLoadMore && (
          <div className="load">
            <LoadMoreIcon fontSize="small" />{" "}
            {comment.totalChildren - comment.children.length} more replies
          </div>
        )}
      </div>
    </div>
  );
}

// CommentsContainer component
export function CommentsContainer({ comments }: { comments: CommentType[] }) {
  return (
    <div className="comments-container">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

// Sample data structure for comments
export // Sample data structure for comments
const commentsData: CommentType[] = [
  {
    id: 1,
    message:
      "This is the first comment This is the first comment This is the first comment This is the first comment This is the first comment This is the first comment This is the first comment ",
    commenterName: "commenter1",
    commenterId: 8,
    commentedAt: "2025-03-21T10:00:00Z",
    totalChildren: 8,
    children: [
      {
        id: 2,
        message: "This is a reply to the first comment",
        commenterName: "commenter2",
        commenterId: 22,
        commentedAt: "2025-03-21T10:30:00Z",
        totalChildren: 4,
        children: [
          {
            id: 3,
            message: "This is a nested reply",
            commenterName: "commenter3",
            commentedAt: "2025-03-21T11:00:00Z",
            commenterId: 8,
            totalChildren: 0,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    message: "This is another top-level comment",
    commenterName: "commenter4",
    commentedAt: "2025-03-21T12:00:00Z",
    commenterId: 4,
    totalChildren: 0,
    children: [],
  },
];
