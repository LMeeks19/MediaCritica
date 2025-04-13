export interface NotificationModel {
    id: number;
    authorUsername: string;
    message: string;
    isRead: boolean;
    isBookmarked: boolean;
    createdAt: string;
  }