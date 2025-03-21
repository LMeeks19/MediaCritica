import { Dialog, DialogContent, DialogTitle, Fab } from "@mui/material";
import { SetterOrUpdater } from "recoil";
import { CommentsContainer, commentsData } from "./Comments";
import CloseIcon from "@mui/icons-material/Close";

function CommentsDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
}) {
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      scroll="paper"
      open={props.open}
      onClose={() => props.setOpen(false)}
    >
      <DialogTitle>
        Comments{" "}
        <Fab onClick={() => props.setOpen(false)}>
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent>
        <CommentsContainer comments={commentsData} />
      </DialogContent>
    </Dialog>
  );
}

export default CommentsDialog;
