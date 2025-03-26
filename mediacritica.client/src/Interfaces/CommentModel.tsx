export interface CommentModel {
  id: number;
  parentId?: number;
  reviewId: number;
  content?: string;
  commenterId?: number;
  commenterName?: string;
  commentedAt?: string;
  replies: CommentModel[];
  totalReplies: number;
  isDeleted: boolean;
}