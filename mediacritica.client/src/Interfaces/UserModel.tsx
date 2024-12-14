import { BacklogSummaryModel } from "./BacklogSummaryModel";

export interface UserModel {
    id: number;
    email: string;
    password: string;
    backlogSummary: BacklogSummaryModel[]
    totalReviews: number;
    totalBacklogs: number
}