import { BacklogSummaryModel } from "./BacklogSummaryModel";

export interface UserModel {
    id: number;
    forename: string;
    surname: string;
    email: string;
    password: string;
    backlogSummary: BacklogSummaryModel[]
    totalReviews: number;
    totalBacklogs: number
}