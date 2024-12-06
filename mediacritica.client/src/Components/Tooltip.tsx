import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "$light-dark",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "$light-dark",
    color: "$primary-red",
    fontSize: 15,
    padding: 5
  },
}));
