import { ReviewModel } from "./ReviewModel";
import { UserMilestoneModel } from "./UserMilestoneModel";

export interface UserSummaryModel {
  id: number;
  username: string;
  joined: string;
  reviews: ReviewModel[];
  milestones: UserMilestoneModel[];
  reviewsWritten: number;
  mediaBacklogged: number;
  followers: number;
  following: number;
  engagementsReceivedLikes: number;
  engagementsReceivedDislikes: number;
  engagementsGivenLikes: number;
  engagementsGivenDislikes: number;
  milestonesEarned: number;
  breakdown: number[];
}
