import { cashRegisterSound } from "./base64Audios";

type Sounds = "cash";

export default class Sound {
  async playSound(sound: Sounds) {
    try {
      if (sound === "cash") {
        await this.playCashRegister();
      }
    } catch {
      console.log("Fail to play cash register sound");
    }
  }

  private playCashRegister() {
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