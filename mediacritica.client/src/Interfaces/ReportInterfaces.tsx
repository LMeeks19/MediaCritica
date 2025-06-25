import { ReportReason, ReportStatus } from "../Enums/ReportEnums"

export interface ReportModelObject {
    id: number;
    
    reportedId: number
    reportedUsername : string

    reviewId: number
    commentId?: number

    reviewTitle?: string
    commentContent?: string

    reportReasons: ReportReasonModel[]

    totalReports: number
    totalApprovedReports: number
    totalRejectedReports: number
    totalPendingReports: number
}

export interface ReportReasonModel {
    id: number
    reason: string
    reports: ReportModel[]
    totalReports: number
    totalApprovedReports: number
    totalRejectedReports: number
    totalPendingReports: number
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
    status: ReportStatus
}