import { ContentStatus } from "../Enums/ContentStatus";

export interface CommentModel {
  id: number;
  parentId?: number;
  reviewId: number;
  content?: string;
  commenterId?: number;
  commenterUsername?: string;
  commentedAt?: string;
  replies: CommentModel[];
  totalReplies: number;
  status: ContentStatus;
}