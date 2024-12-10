import { OverlayBasicCss } from "./types";

export default class BasicOverlayUtil {
  static setStyle(css: OverlayBasicCss) {
    const el = document.getElementById("donation") as HTMLElement;

    el.setAttribute(
      "style",
      `background: ${css.background} !important; border-color: ${css.border_color} !important;`
    );
    el.querySelector("#donatorName")?.setAttribute(
      "style",
      `color: ${css.text_color_highlight} !important;`
    );
    el.querySelector("#amount")?.setAttribute(
      "style",
      `color: ${css.text_color_highlight} !important;`
    );
    el.querySelector("#templateText")?.setAttribute(
      "style",
      `color: ${css.text_color} !important;`
    );
    el.querySelector("#message")?.setAttribute(
      "style",
      `color: ${css.text_color} !important;`
    );
  }
}
