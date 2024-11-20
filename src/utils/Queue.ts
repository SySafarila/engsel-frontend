import Dom from "./Dom";
import Sound from "./Sound";
import { Donation, Donations } from "./types";

export default class Queue {
  private isPlaying: boolean = false;
  private queue: Donations = [];
  private sound = new Sound();
  private DOM = new Dom();

  constructor() {
    console.log("Queue init");
  }

  private numberFormat(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  private addDelay(ms: number): Promise<unknown> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Delay in ${ms} milliseconds success!`);
      }, ms);
    });
  }

  private async startQueue() {
    console.count(
      `Showing donation from ${
        this.getDonation().donator_name
      }, Rp ${this.numberFormat(this.getDonation().amount)}`
    );

    this.isPlaying = true;

    this.DOM.format({
      amount: `Rp ${this.numberFormat(this.getDonation().amount)}`,
      donatorName: this.getDonation().donator_name,
      message: this.getDonation().message,
      templateText: "baru saja memberikan ",
    });
    this.DOM.showDonation();

    await this.sound.playSound("cash");
    await this.addDelay(5000);

    this.DOM.hideDonation();
    this.deletePlayedQueue();
    await this.addDelay(1000);

    if (this.queue.length >= 1) {
      this.startQueue();
    }
  }

  private deletePlayedQueue(): void {
    if (this.queue.length >= 1) {
      this.isPlaying = false;
      this.queue.splice(0, 1);
    }
  }

  private getDonation(): Donation {
    return this.queue[0];
  }

  private addQueue(donation: Donation): void {
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
