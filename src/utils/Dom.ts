import { DomFormat } from "./types";

export default class Dom {
  hideDonation(): void {
    const donation = document.getElementById("donation");
    if (donation && donation.classList.contains("hidden") == false) {
      donation.classList.add("hidden");
    }
  }

  showDonation(): void {
    const donation = document.getElementById("donation");
    if (donation && donation.classList.contains("hidden") == true) {
      donation.classList.remove("hidden");
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
}
