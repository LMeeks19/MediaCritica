export interface CommentModel {
  id: number;
  parentId?: number;
  reviewId: number;
  content?: string;
  commenterId?: number;
  commenterUsername?: string;
  commentedAt?: Date;
  replies: CommentModel[];
  totalReplies: number;
  isDeleted: boolean;
}