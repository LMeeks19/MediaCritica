import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "light-dark(whitesmoke, #242424)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "light-dark(whitesmoke, #242424)",
    color: "light-dark(#242424, whitesmoke)",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
    fontSize: "12.5px",
    padding: "0.5rem 1rem",
    letterSpacing: 0,
    fontFamily: "inherit",
    borderRadius: "8px"
  },
}));
