import { UserMilestoneType } from "../Enums/UserMilestoneType";

export interface UserMilestoneModel {
  title: string;
  description: string;
  level: UserMilestoneType;
  progress: { current: number; target: number } | null;
  earnedDate: string | null;
  icon: string;
}

export interface UserMilestoneModelObject {
    category: string;
    milestones: UserMilestoneModel[]
}
