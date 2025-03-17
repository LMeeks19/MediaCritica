import "./ConfirmationDialog.scss";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { SetterOrUpdater } from "recoil";

function ConfirmationDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  data: ConfirmationDialogModel;
}) {
  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>{props.data.title}? </DialogTitle>
      <DialogContent>{props.data.dialog}</DialogContent>
      <Divider orientation="horizontal" />
      <DialogActions>
        <ButtonGroup>
          <Button className="cancel" onClick={() => props.setOpen(false)}>
            {props.data.cancel_text}
          </Button>
          <Button
            onClick={() => {
              props.data.confirm_action();
              props.setOpen(false);
            }}
          >
            {props.data.confirm_text}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
