import Dom from "./Dom";
import { DomFormat } from "./types";

export default class DomF1Radio extends Dom {
  private intervals: NodeJS.Timeout[] = [];

  hideDonation(): void {
    const radio = document.getElementById("radio");
    if (radio && radio.classList.contains("hidden") == false) {
      radio.classList.add("hidden");
    }
  }

  showDonation(): void {
    const radio = document.getElementById("radio");
    if (radio && radio.classList.contains("hidden") == true) {
      radio.classList.remove("hidden");
    }
  }

  formatMessage(data: DomFormat): void {
    const donatorName = document.getElementById("donatorName");
    const templateText = document.getElementById("templateText");
    const message = document.getElementById("message");
    const amount = document.getElementById("amount");

    if (donatorName) {
      donatorName.innerText = data.donatorName;
    }
    if (templateText) {
      templateText.innerText = data.templateText;
    }
    if (message) {
      message.innerText = data.message;
    }
    if (amount) {
      amount.innerText = data.amount;
    }
  }

  startAudioVisual() {
    const audioVisuals: NodeListOf<Element> =
      document.querySelectorAll("#audio-visual div");

    audioVisuals.forEach((el) => {
      const intervalId = setInterval(() => {
        el.setAttribute("style", `height: ${Math.random() * 100}%`);
      }, 150);
      this.intervals.push(intervalId);
    });
  }

  stopAudioVisual() {
    const audioVisuals: NodeListOf<Element> =
      document.querySelectorAll("#audio-visual div");

    audioVisuals.forEach((el) => {
      el.setAttribute("style", "height: 5%");
    });

    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals = [];
  }
}
