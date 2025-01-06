import { UserMilestoneLevelType } from "../Enums/UserMilestoneLevelType";

export interface UserMilestoneModel {
  title: string;
  description: string;
  earnedLevel: UserMilestoneLevelType;
  progress: { current: number; target: number; percentage: number };
  earnedDate: Date | null;
}

export interface UserMilestoneModelObject {
  category: string;
  milestones: UserMilestoneModel[];
}
