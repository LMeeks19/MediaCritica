import { useEffect, useState } from "react";
import TopBar from "../Components/TopBar";
import "./Admin.scss";
import {
  ReportModel,
  ReportModelObject,
  ReportReasonModel,
} from "../Interfaces/ReportInterfaces";
import { GetCommentReports } from "../Server/Server";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ReviewsIcon from "@mui/icons-material/ReviewsOutlined";
import CommentIcon from "@mui/icons-material/CommentOutlined";
import { CustomTooltip } from "../Components/Tooltip";
import { useNavigate } from "react-router-dom";
import { ReportStatus } from "../Enums/ReportEnums";

function AdminPage() {
  const [reports, setReports] = useState<ReportModelObject[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function GetRports() {
      const reports = await GetCommentReports();
      setReports(reports);
    }
    GetRports();
  }, []);

  function getReportStatusString(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.PENDING:
        return "Pending";
      case ReportStatus.APPROVED:
        return "Approved";
      case ReportStatus.REJECTED:
        return "Rejected";
      default:
        return "";
    }
  }

  function ReportCard(props: { report: ReportModelObject }) {
    const report = props.report;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <div className="report-card" key={report.id}>
        <div className="report-card-details" onClick={() => setIsOpen(!isOpen)}>
          <div className="report-card-title">
            {report.reviewTitle ?? report.commentContent}
          </div>
          <div className="ml-auto flex gap-[1.25rem]">
            <CustomTooltip title="View reported user's profile">
              <div
                className="reported-user"
                onClick={() =>
                  navigate(`/view-user/${report.reportedUsername}`)
                }
              >
                {report.reportedUsername}
              </div>
            </CustomTooltip>
            <CustomTooltip title="Pending / Approved / Rejected / Total">
              <div className="report-card-counts">
                {`${report.totalPendingReports} / ${report.totalApprovedReports} / ${report.totalRejectedReports} / ${report.totalReports}`}
              </div>
            </CustomTooltip>
          </div>
        </div>
        {isOpen &&
          report.reportReasons.map((reason) => (
            <ReportReason reason={reason} />
          ))}
      </div>
    );
  }

  function ReportReason(props: { reason: ReportReasonModel }) {
    const reason = props.reason;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <div className="report-reason" key={reason.id}>
        <div className="reason-details" onClick={() => setIsOpen(!isOpen)}>
          <div className="reason-name">Reason: {reason.reason}</div>
          <div className="ml-auto flex gap-[1.25rem]">
            <CustomTooltip title="Pending / Approved / Rejected / Total">
              <div className="reason-counts">
                {`${reason.totalPendingReports} / ${reason.totalApprovedReports} / ${reason.totalRejectedReports} / ${reason.totalReports}`}
              </div>
            </CustomTooltip>
          </div>
        </div>
        <div className="reports">
          {isOpen && reason.reports.map((report) => <Report report={report} />)}
        </div>
      </div>
    );
  }

  function Report(props: { report: ReportModel }) {
    const report = props.report;

    return (
      <div className="report" key={report.id}>
        <div>Details: {report.details}</div>
        <div className={`status ${getReportStatusString(report.status)}`}>
          {getReportStatusString(report.status)}
        </div>
        <CustomTooltip title="View reporter's profile">
          <div
            className="reporter"
            onClick={() => navigate(`/view-user/${report.reporterUsername}`)}
          >
            {report.reporterUsername}
          </div>
        </CustomTooltip>
        <div className="date">{report.reportedAt}</div>
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
        <div className="admin-reports">
          {reports.map((report) => (
            <ReportCard report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
