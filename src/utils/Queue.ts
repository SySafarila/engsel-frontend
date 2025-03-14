import Dom from "./Dom";
import formatRupiah from "./formatRupiah";
import Sound from "./Sound";
import { Donation, Donations } from "./types";

export default class Queue {
  protected isPlaying: boolean = false;
  protected queue: Donations = [];
  protected sound = new Sound();
  protected DOM: Dom | undefined = undefined;

  constructor({ DOM }: { DOM: Dom }) {
    console.log("Queue init");
    this.DOM = DOM;
  }

  protected addDelay(ms: number): Promise<unknown> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Delay in ${ms} milliseconds success!`);
      }, ms);
    });
  }

  protected async startQueue() {
    const donate = this.getFirstDonation();
    console.count(
      `Showing donation from ${donate.donator_name}, Rp ${formatRupiah(
        donate.amount
      )}`
    );

    this.isPlaying = true;

    this.DOM?.formatMessage({
      amount: `Rp ${formatRupiah(donate.amount)}`,
      donatorName: donate.donator_name,
      message: donate.message,
      templateText: "baru saja memberikan",
    });
    this.DOM?.showDonation();

    await this.sound.playSound("cash");
    if (donate.tts && donate.tts.length > 0) {
      console.log("playing tts");
      await this.sound
        .playTts(`data:audio/mpeg;base64,${donate.tts[0]}`)
        .catch(() => {
          console.log("tts[0] fail to play");
        });
      await this.addDelay(250);
      await this.sound
        .playTts(`data:audio/mpeg;base64,${donate.tts[1]}`)
        .catch(() => {
          console.log("tts[1] fail to play");
        });
      console.log("tts played");
    }
    await this.addDelay(5000);

    this.DOM?.hideDonation();
    this.deletePlayedQueue();
    await this.addDelay(1000);

    if (this.queue.length >= 1) {
      this.startQueue();
    }
  }

  protected deletePlayedQueue(): void {
    if (this.queue.length >= 1) {
      this.isPlaying = false;
      this.queue.splice(0, 1);
    }
  }

  protected getFirstDonation(): Donation {
    return this.queue[0];
  }

  protected addQueue(donation: Donation): void {
    this.queue.push(donation);

    if (this.isPlaying === false) {
      this.startQueue();
    }
  }

  incomingDonation = (donation: Donation) => {
    console.log("Donate incoming!!!");
    this.addQueue(donation);
  };
}
