import { UserMilestoneLevel } from "../Enums/UserMilestoneLevel";
import { UserMilestoneType } from "../Enums/UserMilestoneType";

export interface UserMilestoneModel {
  title: string;
  description: string;
  type: UserMilestoneType
  earnedLevel: UserMilestoneLevel;
  progress: { current: number; target: number; percentage: number };
  earnedDate: Date | null;
}

export interface UserMilestoneModelObject {
  category: string;
  milestones: UserMilestoneModel[];
  isPalette?: boolean
}
