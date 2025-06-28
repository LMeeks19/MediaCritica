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
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import { CustomTooltip } from "../Components/Tooltip";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";

function AdminPage() {
  const [reports, setReports] = useState<ReportModelObject[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    async function GetRports() {
      const reports = await GetCommentReports();
      setReports(reports);
    }
    GetRports();
  }, []);

  function ReportCard(props: { report: ReportModelObject }) {
    const report = props.report;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <div className="report-card">
        <div className="report-card-details" onClick={() => setIsOpen(!isOpen)}>
          <ReactQuill
            className="report-card-title"
            value={JSON.parse(report.commentContent!) as DeltaStatic}
            readOnly
          />
          <div className="ml-auto flex gap-4">
            <CustomTooltip title="View reported user's profile">
              <div
                className="reported-user"
                onClick={() =>
                  window.open(`/view-user/${report.reportedUsername}`)
                }
              >
                {report.reportedUsername}
              </div>
            </CustomTooltip>
            <CustomTooltip
              title={`View ${
                report.commentContent !== null ? "comment" : "review"
              }`}
            >
              <div
                className="view-content"
                onClick={() =>
                  window.open(
                    `/${report.mediaType}/${report.mediaId}/reviews/${report.reviewId}`,
                    "_blank"
                  )
                }
              >
                <VisibilityIcon />
              </div>
            </CustomTooltip>
          </div>
        </div>
        {isOpen &&
          report.reportReasons.map((reason) => (
            <ReportReason key={reason.id} reason={reason} />
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
          <div className="reason-name">{reason.reason}</div>
          <div className="ml-auto">
            <CustomTooltip title="Total reports for reasons">
              <div className="reason-counts">{reason.totalReports}</div>
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
        <div className="flex gap-4 ml-auto">
          <CustomTooltip title="View reporter's profile">
            <div
              className="reporter"
              onClick={() =>
                window.open(`/view-user/${report.reporterUsername}`)
              }
            >
              {report.reporterUsername}
            </div>
          </CustomTooltip>
          <CustomTooltip title="Reported at">
            <div className="date">{report.reportedAt}</div>
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
          <div className="admin-reports">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
