import { cashRegisterSound, incomingRadioSound } from "./base64Audios";

type Sounds = "cash" | "incoming-radio-sound";

export default class Sound {
  private makeDistortionCurve(amount: number) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] =
        ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  private makeRadioEffect(audio: HTMLAudioElement): AudioContext {
    const lowpassValue = 3000;
    const highpassValue = 500;
    const distortionValue = 65;

    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaElementSource(audio);

    const lowpassFilter = audioContext.createBiquadFilter();
    lowpassFilter.type = "lowpass";
    lowpassFilter.frequency.value = lowpassValue;

    const highpassFilter = audioContext.createBiquadFilter();
    highpassFilter.type = "highpass";
    highpassFilter.frequency.value = highpassValue;

    const distortion = audioContext.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(distortionValue);
    distortion.oversample = "4x";

    source.connect(highpassFilter);
    highpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(distortion);
    distortion.connect(audioContext.destination);

    return audioContext;
  }

  playTtsWithRadioEffect(base64: string) {
    return new Promise((resolve, reject) => {
      try {
        const sound = new Audio(base64);
        const radioEffect = this.makeRadioEffect(sound);
        radioEffect.resume();
        sound.addEventListener(
          "pause",
          () => {
            resolve("Success!");
          },
          { once: true }
        );

        sound.play().catch((e) => reject(e));
      } catch {
        reject("Failed!");
      }
    });
  }

  playTts(base64: string) {
    return new Promise((resolve, reject) => {
      try {
        const sound = new Audio(base64);
        sound.addEventListener(
          "pause",
          () => {
            resolve("Success!");
          },
          { once: true }
        );

        sound.play().catch((e) => reject(e));
      } catch {
        reject("Failed!");
      }
    });
  }

  async playSound(sound: Sounds) {
    try {
      switch (sound) {
        case "cash":
          await this.playCashRegister();
          break;

        case "incoming-radio-sound":
          await this.playIncomingRadio();
          break;

        default:
          break;
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

  private playIncomingRadio() {
    return new Promise((resolve, reject) => {
      try {
        const sound = new Audio(`data:audio/wav;base64,${incomingRadioSound}`);
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
