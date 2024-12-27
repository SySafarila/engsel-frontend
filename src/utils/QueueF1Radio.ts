import DomF1Radio from "./DomF1Radio";
import formatRupiah from "./formatRupiah";
import Queue from "./Queue";

export default class QueueF1Radio extends Queue {
  protected DOM: DomF1Radio | undefined = undefined;
  constructor({ DOM }: { DOM: DomF1Radio }) {
    super({ DOM });
    console.log("Queue init");
    this.DOM = DOM;
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

    await this.sound.playSound("incoming-radio-sound");
    if (donate.tts && donate.tts.length > 0) {
      this.DOM?.startAudioVisual();
      console.log("playing tts");
      await this.sound
        .playTtsWithRadioEffect(`data:audio/mpeg;base64,${donate.tts[0]}`)
        .catch(() => {
          console.log("tts[0] fail to play");
        });
      await this.addDelay(250);
      await this.sound
        .playTtsWithRadioEffect(`data:audio/mpeg;base64,${donate.tts[1]}`)
        .catch(() => {
          console.log("tts[1] fail to play");
        });
      this.DOM?.stopAudioVisual();
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
}
