import { BacklogSummaryModel } from "./BacklogSummaryModel";

export interface UserModel {
    id: number;
    forename: string;
    surname: string;
    email: string;
    password: string;
    preference: PreferenceModel;
    backlogSummary: BacklogSummaryModel[]
    totalReviews: number;
    totalBacklogs: number
}

export interface PreferenceModel {
    id: number
    theme: string;
    palette: string;
}