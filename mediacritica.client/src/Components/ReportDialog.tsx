import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { CustomTooltip } from "./Tooltip";
import FlagIcon from "@mui/icons-material/FlagOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { ReportReason } from "../Enums/ReportReason";
import { useRef, useState } from "react";
import { userState } from "../State/GlobalState";
import { ReportComment, ReportReview } from "../Server/Server";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
import { ReportModel } from "../Interfaces/ReportInterfaces";

function ReportDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  commentId?: number;
  reviewId?: number;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState<string>("{}");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const user = useRecoilValue(userState);
  const quillRef = useRef<ReactQuill>(null);

  const handleReport = async () => {
    const report = {
      commentId: props.commentId,
      reviewId: props.reviewId,
      reporterId: user.id,
      reason: reason,
      details: details,
    } as ReportModel;

    if (report.commentId && !report.reviewId) await ReportComment(report);
    else if (report.reviewId && !report.commentId) await ReportReview(report);

    setReason(null);
    setDetails("{}");
    setCharacterCount(0);
    props.setOpen(false);
  };

  const modules = {
    toolbar: [],
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Report {props.commentId ? "Comment" : "Review"}{" "}
        <Fab
          onClick={() => {
            setReason(null);
            setDetails("{}");
            setCharacterCount(0);
            props.setOpen(false);
          }}
        >
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent className="report-dialog">
        Reason
        <ToggleButtonGroup
          className="toggle-button-group"
          value={reason}
          onChange={(_e, v) => setReason(v)}
          fullWidth
          exclusive
        >
          {Object.entries(ReportReason)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => (
              <ToggleButton className="toggle-button" key={key} value={value}>
                {key}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
        Details (Optional)
        <ReactQuill
          className="toolbar-hidden"
          value={JSON.parse(details) as DeltaStatic}
          onChange={(_v, _d, _s, editor) => {
            const textLength = editor.getLength() - 1;
            const quill = quillRef.current?.getEditor();
            if (textLength <= 500) {
              setDetails(JSON.stringify(editor.getContents()));
              setCharacterCount(textLength);
            } else if (quill) {
              quill.deleteText(500, textLength - 500); // Remove extra characters
            }
          }}
          modules={modules}
          placeholder="Enter details..."
        />
        <div className="character-count">{characterCount}/500</div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <ButtonGroup>
          <Button disabled={reason === null} onClick={handleReport}>
            <CustomTooltip title="Report">
              <FlagIcon />
            </CustomTooltip>
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
export default ReportDialog;
