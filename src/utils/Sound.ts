import { cashRegisterSound } from "./base64Audios";

export default class Sound {
  playCashRegister() {
    return new Promise((resolve, reject) => {
      try {
        const sound = new Audio(`data:audio/wav;base64,${cashRegisterSound}`);
        sound.play().catch((e) => reject(e));
        sound.addEventListener(
          "pause",
          () => {
            resolve("Success!");
          },
          { once: true }
        );
      } catch {
        reject("Failed!");
      }
    });
  }
}
