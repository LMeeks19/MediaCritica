import {
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Button,
} from "@mui/material";
import { SetterOrUpdater } from "recoil";
import CloseIcon from "@mui/icons-material/Close";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import ClipboardCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import { CustomTooltip } from "./Tooltip";
import { ReviewModel } from "../Interfaces/ReviewModel";

export function ShareDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  review: ReviewModel;
}) {
  function copyToClipboard() {
    navigator.clipboard.writeText(
      `Check out this review on MediaCritica: ${window.location.href}`
    );
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      scroll="paper"
      open={props.open}
      onClose={() => {
        props.setOpen(false);
      }}
    >
      <DialogTitle>
        Share
        <Fab
          onClick={() => {
            props.setOpen(false);
          }}
        >
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent>Where would you like to share this review?</DialogContent>
      <Divider />
      <DialogActions>
        <ButtonGroup>
          <Button onClick={copyToClipboard}>
            <CustomTooltip title="Copy to clipboard">
              <ClipboardCopyIcon />
            </CustomTooltip>
          </Button>
          <Button>
            <CustomTooltip title="Reddit">
              <RedditIcon />
            </CustomTooltip>
          </Button>
          <Button>
            <CustomTooltip title="Facebook">
              <FacebookIcon />
            </CustomTooltip>
          </Button>
          <Button>
            <CustomTooltip title="X">
              <XIcon />
            </CustomTooltip>
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
