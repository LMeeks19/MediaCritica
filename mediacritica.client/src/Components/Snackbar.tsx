import { enqueueSnackbar, VariantType } from "notistack";

export function Snackbar(message: string, variant: VariantType) {
  enqueueSnackbar(message, { variant: variant });
}
