import { ReportReason } from "../Enums/ReportEnums";

export interface ReportModel {
    id: number;
    reviewId?: number;
    commentId?: number;
    reporterId: number;
    reason: ReportReason;
    details: string;
    reportedAt: Date;
}