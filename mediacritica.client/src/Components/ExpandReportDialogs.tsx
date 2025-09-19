import { Dialog, DialogTitle, Fab, DialogContent } from "@mui/material";
import { SetterOrUpdater } from "recoil";
import CloseIcon from "@mui/icons-material/Close";
import { ReportModel, ReportModelObject } from "../Interfaces/ReportInterfaces";
import { DeltaStatic } from "quill";
import ReactQuill from "react-quill";
import "./ExpandReportDialogs.scss";

export function ExpandReportDialog(props: {
  open: boolean;
  setIsOpen: SetterOrUpdater<boolean>;
  report: ReportModel;
}) {
  return (
    <Dialog open={props.open} maxWidth="md" fullWidth>
      <DialogTitle>
        Expanded Report
        <Fab onClick={() => props.setIsOpen(false)}>
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent>{props.report.details}</DialogContent>
    </Dialog>
  );
}

export function ExpandCommentDialog(props: {
  open: boolean;
  setIsOpen: SetterOrUpdater<boolean>;
  reportObject: ReportModelObject;
}) {
  return (
    <Dialog open={props.open} maxWidth="md" fullWidth>
      <DialogTitle>
        Expanded Comment
        <Fab onClick={() => props.setIsOpen(false)}>
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent>
        <ReactQuill
          className="details-box"
          value={JSON.parse(props.reportObject.commentContent!) as DeltaStatic}
          readOnly
        />
      </DialogContent>
    </Dialog>
  );
}

export function ExpandReviewDalog(props: {
  open: boolean;
  setIsOpen: SetterOrUpdater<boolean>;
  reportObject: ReportModelObject;
}) {
  return (
    <Dialog open={props.open} maxWidth="md" fullWidth>
      <DialogTitle>
        Expanded Report
        <Fab onClick={() => props.setIsOpen(false)}>
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent>
        <div>{props.reportObject.reviewTitle}</div>
        <ReactQuill
          className="details-box"
          value={
            JSON.parse(props.reportObject.reviewDescription!) as DeltaStatic
          }
          readOnly
        />
      </DialogContent>
    </Dialog>
  );
}
