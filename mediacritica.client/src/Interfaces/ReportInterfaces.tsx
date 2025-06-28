import { ReportReason } from "../Enums/ReportReason"

export interface ReportModelObject {
    id: number
    reviewId: number;
    commentId?: number
    mediaId: string
    mediaType: string
    reportedUsername : string
    reviewTitle?: string
    commentContent?: string
    reportReasons: ReportReasonModel[]
}

export interface ReportReasonModel {
    id: number
    reason: string
    reports: ReportModel[]
    totalReports: number
}

export interface ReportModel {
    id: number
    reviewId?: number
    commentId?: number
    reporterId: number
    reporterUsername: string
    reason: ReportReason
    details: string
    reportedAt: string
}