type Format = {
  donatorName: string;
  templateText: string;
  message: string;
  amount: string;
};

export default class Dom {
  hideDonation() {
    const el = document.getElementById("donation");
    if (el && el.classList.contains("hidden") == false) {
      el.classList.add("hidden");
    }
  }

  showDonation() {
    const el = document.getElementById("donation");
    if (el && el.classList.contains("hidden") == true) {
      el.classList.remove("hidden");
    }
  }

  format(data: Format) {
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
