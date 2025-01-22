import { enqueueSnackbar, VariantType } from "notistack";

export default class Snackbar {
  private static Call(message: string, variant: VariantType) {
    enqueueSnackbar(message, { variant: variant });
  }

  public static Success(message: string) {
    this.Call(message, "success");
  }

  public static Info(message: string) {
    this.Call(message, "info");
  }

  public static Error(message: string) {
    this.Call(message, "error");
  }

  public static Warning(message: string) {
    this.Call(message, "warning");
  }

  public static Default(message: string) {
    this.Call(message, "default");
  }
}
