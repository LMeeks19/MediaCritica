import { useEffect, useState } from "react";
import TopBar from "../Components/TopBar";
import "./Admin.scss";
import {
  ReportModel,
  ReportModelObject,
  ReportReasonModel,
} from "../Interfaces/ReportInterfaces";
import {
  GetCommentReports,
  UpdateReportStatus,
  GetReviewReports,
  GetMoreReviewReports,
  GetMoreCommentReports,
} from "../Server/Server";
import {
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ReviewsIcon from "@mui/icons-material/ReviewsOutlined";
import CommentIcon from "@mui/icons-material/CommentOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import { CustomTooltip } from "../Components/Tooltip";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
import ApproveIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RejectIcon from "@mui/icons-material/CancelOutlined";
import UserIcon from "@mui/icons-material/AccountCircleOutlined";
import { ReportAction } from "../Enums/ContentStatus";
import Loader from "../Components/Loader";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmptyOutlined";

function AdminPage() {
  const [reports, setReports] = useState<ReportModelObject[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    GetRports();
  }, [selectedTab]);

  async function GetRports() {
    setIsLoading(true);
    var reports: ReportModelObject[] = [];
    selectedTab === 0
      ? (reports = await GetReviewReports())
      : (reports = await GetCommentReports());
    setReports(reports);
    setIsLoading(false);
  }

  async function GetMoreReports(id: number, reason: number, offset: number) {
    var newReports: ReportModel[] = [];
    selectedTab === 0
      ? (newReports = await GetMoreReviewReports(id, reason, offset))
      : (newReports = await GetMoreCommentReports(id, reason, offset));

    var updatedReportObjectModels = reports.map((report) => {
      return {
        ...report,
        reportReasons: report.reportReasons.map((reportReason) => {
          if (reportReason.reasonId === reason) {
            return {
              ...reportReason,
              reports: [...reportReason.reports, ...newReports],
            };
          } else return reportReason;
        }),
      };
    });

    setReports(updatedReportObjectModels);
  }

  async function UpdateReport(
    index: number,
    action: ReportAction,
    reviewId?: number,
    commentId?: number
  ) {
    await UpdateReportStatus({ reviewId, commentId, action });
    const updatedReports = reports.filter((report) => report.id !== index);
    setReports(updatedReports);
  }

  function ReportCard(props: { report: ReportModelObject }) {
    const report = props.report;
    const [isOpen, setIsOpen] = useState<boolean>(true);

    return (
      <div className="report-card">
        <div className="report-card-details" onClick={() => setIsOpen(!isOpen)}>
          <ReactQuill
            className="report-card-title"
            value={JSON.parse(report.commentContent!) as DeltaStatic}
            readOnly
          />
          <div className="ml-auto flex gap-3">
            <ButtonGroup>
              <CustomTooltip title="Approve report">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    UpdateReport(
                      report.id,
                      ReportAction.Approve,
                      report.reviewId,
                      report.commentId
                    );
                  }}
                >
                  <ApproveIcon fontSize="small" />
                </Button>
              </CustomTooltip>
              <CustomTooltip title="Reject report">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    UpdateReport(
                      report.id,
                      ReportAction.Reject,
                      report.reviewId,
                      report.commentId
                    );
                  }}
                >
                  <RejectIcon fontSize="small" />
                </Button>
              </CustomTooltip>
            </ButtonGroup>
            <CustomTooltip title="View reported user's profile">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/view-user/${report.reportedUsername}`);
                }}
              >
                <UserIcon fontSize="small" />
              </Button>
            </CustomTooltip>
            <CustomTooltip
              title={`View ${
                report.commentContent !== null ? "comment" : "review"
              }`}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `/${report.mediaType}/${report.mediaId}/reviews/${report.reviewId}`,
                    "_blank"
                  );
                }}
              >
                <VisibilityIcon fontSize="small" />
              </Button>
            </CustomTooltip>
          </div>
        </div>
        {isOpen &&
          report.reportReasons.map((reason) => (
            <ReportReason
              key={reason.reasonId}
              reason={reason}
              parentId={report.commentId ?? report.reviewId}
            />
          ))}
      </div>
    );
  }

  function ReportReason(props: {
    reason: ReportReasonModel;
    parentId: number;
  }) {
    const reason = props.reason;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <div className="report-reason" key={reason.reasonId}>
        <div className="reason-details" onClick={() => setIsOpen(!isOpen)}>
          <div className="reason-name">{reason.reasonText}</div>
          <div className="flex gap-3 ml-auto">
            {reason.reports.length < reason.totalReports && isOpen && (
              <CustomTooltip title="Load more">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    GetMoreReports(
                      props.parentId,
                      reason.reasonId,
                      reason.reports.length
                    );
                  }}
                >
                  <HourglassEmptyIcon fontSize="small" />
                </Button>
              </CustomTooltip>
            )}
            <CustomTooltip title="Total reason reports">
              <Button className="readonly">
                <div className="flex justify-center items-center text-[12.5px] w-[20px] h-[20px]">
                  {reason.totalReports}
                </div>
              </Button>
            </CustomTooltip>
          </div>
        </div>
        <div className="reports">
          {isOpen &&
            reason.reports.map((report) => (
              <Report key={report.id} report={report} />
            ))}
        </div>
      </div>
    );
  }

  function Report(props: { report: ReportModel }) {
    const report = props.report;

    return (
      <div className="report" key={report.id}>
        <div className="report-details">{report.details}</div>
        <div className="flex gap-3 ml-auto">
          <CustomTooltip title="View reporter's profile">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/view-user/${report.reporterUsername}`);
              }}
            >
              <UserIcon fontSize="small" />
            </Button>
          </CustomTooltip>
          <CustomTooltip title="Reported at">
            <Button className="readonly">{report.reportedAt}</Button>
          </CustomTooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="adminpage-container">
      <div className="admin">
        <TopBar />
        <div className="header">
          <h1>Admin</h1>
          <div className="actions">
            <ToggleButtonGroup
              value={selectedTab}
              onChange={(_e, v) => {
                if (v !== null) setSelectedTab(v);
              }}
              exclusive
            >
              <CustomTooltip title="Review Reports">
                <ToggleButton value={0}>
                  <ReviewsIcon />
                </ToggleButton>
              </CustomTooltip>
              <CustomTooltip title="Comment Reports">
                <ToggleButton value={1}>
                  <CommentIcon />
                </ToggleButton>
              </CustomTooltip>
            </ToggleButtonGroup>
          </div>
        </div>
        <div className="content">
          {isLoading ? (
            <Loader />
          ) : reports.length === 0 ? (
            <div className="admin-reports empty">
              No {selectedTab === 0 ? "Review" : "Comment"} Reports
            </div>
          ) : (
            <div className="admin-reports">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
