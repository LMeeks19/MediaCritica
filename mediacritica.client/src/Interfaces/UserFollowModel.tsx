export interface UserFollowModel {
  id: number;
  followerId: number;
  followedId: number;
  followedOn: Date;
  enabledNotifications: boolean
}
