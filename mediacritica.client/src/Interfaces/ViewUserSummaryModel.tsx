import { ReviewModel } from "./ReviewModel";
import { UserMilestoneModel } from "./UserMilestoneModel";

export interface ViewUserSummaryModel {
    name: string;
    joined: Date;
    reviews: ReviewModel[]; // Array of reviews mapped to a specific model
    milestones: UserMilestoneModel[]
    reviewsWritten: number; // Total number of reviews written
    mediaBacklogged: number; // Total count of backlogged media
    followers: number; // Number of followers
    following: number; // Number of users being followed
    engagementsReceivedLikes: number; // Total likes received on reviews
    engagementsReceivedDislikes: number; // Total dislikes received on reviews
    engagementsGivenLikes: number; // Total likes given by the user
    engagementsGivenDislikes: number; // Total dislikes given by the user
    milestonesEarned: number; // Count of milestones achieved by the user
    breakdown: number[]; // Breakdown of user's reviews (type can be replaced as needed)
  }