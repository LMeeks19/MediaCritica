import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "rgba(151, 18, 18, 1)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(151, 18, 18, 1)",
    color: "light-dark(#242424, whitesmoke)",
    fontSize: 15,
    padding: 5
  },
}));
