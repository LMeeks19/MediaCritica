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
import RedditIcon from "@mui/icons-material/Reddit";
import ClipboardCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import { CustomTooltip } from "./Tooltip";
import { ReviewModel } from "../Interfaces/ReviewModel";

export function ShareDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  review: ReviewModel;
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `Check out this review for: ${props.review.title} ${window.location.href}`
    );
  };

  const handleRedditShare = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
      window.location.href
    )}&title=${encodeURIComponent(
      `Check out this review for: ${props.review.mediaTitle}`
    )}`;
    window.open(redditUrl, "_blank", "noopener,noreferrer");
  };

  const handleXShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out this review for: ${props.review.mediaTitle}`
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

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
          <Button onClick={handleRedditShare}>
            <CustomTooltip title="Reddit">
              <RedditIcon />
            </CustomTooltip>
          </Button>
          <Button onClick={handleXShare}>
            <CustomTooltip title="X (formerly Twitter)">
              <XIcon />
            </CustomTooltip>
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
