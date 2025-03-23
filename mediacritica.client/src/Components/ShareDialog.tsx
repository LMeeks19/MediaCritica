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
import { CommentModel } from "./Comments";

export function ShareDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  message: string;
  review?: ReviewModel;
  comment?: CommentModel;
}) {
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
      <DialogContent>{props.message}</DialogContent>
      <Divider />
      <DialogActions>
        <ButtonGroup>
          <Button>
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
