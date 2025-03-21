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
import { CustomTooltip } from "./Tooltip";

function ConfirmationDialog(props: {
  open: boolean;
  setOpen: SetterOrUpdater<boolean>;
  data: ConfirmationDialogModel;
}) {
  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle>{props.data.title}</DialogTitle>
      <DialogContent>{props.data.dialog}</DialogContent>
      <Divider orientation="horizontal" />
      <DialogActions>
        <ButtonGroup>
          <Button onClick={() => props.setOpen(false)}>
            <CustomTooltip title={props.data.cancel_text} arrow>
              {props.data.cancel_icon}
            </CustomTooltip>
          </Button>
          <Button
            onClick={() => {
              props.data.confirm_action();
              props.setOpen(false);
            }}
          >
            <CustomTooltip title={props.data.confirm_text} arrow>
              {props.data.confirm_icon}
            </CustomTooltip>
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
