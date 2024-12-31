import { F1RadioSettings } from "./types";

export default class F1RadioOverlayUtil {
  static setSettings(settings: F1RadioSettings) {
    const el = document.getElementById("radio") as HTMLElement;

    const driverName = el?.querySelector("#driver-name") as HTMLElement;

    if (driverName) {
      driverName.innerText = settings.driver_name;
    }

    el.classList.forEach((className) => {
      if (className != "hidden") {
        el.classList.remove(className);
      }
    });
    el.classList.add(settings.team);
  }
}
