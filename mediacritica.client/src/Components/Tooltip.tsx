import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "light-dark(#242424, whitesmoke)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "light-dark(#242424, whitesmoke)",
    color: "rgba(151, 18, 18, 1)",
    fontSize: 15,
    padding: 5
  },
}));
