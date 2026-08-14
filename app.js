(function () {
  "use strict";

  var PAYEE = {
    address: "medhanshkhattar05@okicici",
    name: "Medhansh Khattar",
    currency: "INR",
    defaultNote: "NFC payment"
  };

  var UPI_APPS = [
    { id: "gpay", name: "Google Pay", mark: "G", packageName: "com.google.android.apps.nbu.paisa.user" },
    { id: "phonepe", name: "PhonePe", mark: "Pe", packageName: "com.phonepe.app" },
    { id: "paytm", name: "Paytm", mark: "P", packageName: "net.one97.paytm" },
    { id: "famapp", name: "FamApp", mark: "F", packageName: "com.fampay.in" },
    { id: "bhim", name: "BHIM", mark: "B", packageName: "in.org.npci.upiapp" }
  ];

  var form = document.getElementById("payment-form");
  var amountInput = document.getElementById("amount");
  var descriptionInput = document.getElementById("description");
  var descriptionCount = document.getElementById("description-count");
  var amountError = document.getElementById("amount-error");
  var continueButton = document.getElementById("continue-button");
  var appPicker = document.getElementById("app-picker");
  var appList = document.getElementById("app-list");
  var editPaymentButton = document.getElementById("edit-payment");
  var launchStatus = document.getElementById("launch-status");
  var submitAttempted = false;
  var siteStyles = document.getElementById("site-styles");

  if (siteStyles) {
    siteStyles.media = "all";
  }

  function sanitizeAmount(value) {
    var normalized = value.replace(/[^\d.]/g, "");
    var decimalIndex = normalized.indexOf(".");

    if (decimalIndex === -1) return normalized;

    return normalized.slice(0, decimalIndex + 1) +
      normalized.slice(decimalIndex + 1).replace(/\./g, "").slice(0, 2);
  }

  function readAmount() {
    return parseFloat(amountInput.value);
  }

  function validateAmount(showError) {
    var amount = readAmount();
    var message = "";

    if (!amountInput.value) {
      message = "Enter an amount to continue.";
    } else if (!isFinite(amount) || amount <= 0) {
      message = "Enter an amount greater than ₹0.";
    }

    continueButton.disabled = Boolean(message);
    amountError.textContent = showError ? message : "";
    amountError.hidden = !(showError && message);

    return !message;
  }

  function encodeQuery(fields) {
    var pairs = [];
    var key;

    for (key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(fields[key]));
      }
    }

    return pairs.join("&");
  }

  function createTransactionReference() {
    var timestamp = new Date().getTime().toString(36).toUpperCase();
    var randomPart = Math.floor(Math.random() * 1679616).toString(36).toUpperCase();
    return "NFC" + timestamp + ("0000" + randomPart).slice(-4);
  }

  function buildPaymentQuery(reference) {
    var description = descriptionInput.value.replace(/^\s+|\s+$/g, "");

    return encodeQuery({
      pa: PAYEE.address,
      pn: PAYEE.name,
      tr: reference,
      tn: description || PAYEE.defaultNote,
      am: readAmount().toFixed(2),
      cu: PAYEE.currency
    });
  }

  function buildIntentUrl(app, paymentQuery) {
    var storeUrl = "https://play.google.com/store/apps/details?id=" + app.packageName;

    return "intent://pay?" + paymentQuery +
      "#Intent;scheme=upi" +
      ";package=" + app.packageName +
      ";action=android.intent.action.VIEW" +
      ";category=android.intent.category.BROWSABLE" +
      ";S.browser_fallback_url=" + encodeURIComponent(storeUrl) +
      ";end";
  }

  function isAndroidDevice() {
    return /Android/i.test(navigator.userAgent);
  }

  function createAppLink(app, paymentQuery) {
    var link = document.createElement("a");
    var mark = document.createElement("span");
    var name = document.createElement("span");
    var action = document.createElement("span");

    link.className = "app-link";
    link.href = buildIntentUrl(app, paymentQuery);
    link.setAttribute("aria-label", "Open " + app.name);

    mark.className = "app-mark";
    mark.setAttribute("data-brand", app.id);
    mark.textContent = app.mark;

    name.className = "app-name";
    name.textContent = app.name;

    action.className = "app-action";
    action.textContent = "Open ›";

    link.appendChild(mark);
    link.appendChild(name);
    link.appendChild(action);

    link.addEventListener("click", function (event) {
      if (!isAndroidDevice()) {
        event.preventDefault();
        launchStatus.textContent = "UPI app links require an Android phone.";
        return;
      }

      launchStatus.textContent = "Opening " + app.name + "…";
    });

    return link;
  }

  function renderAppChoices() {
    var paymentQuery = buildPaymentQuery(createTransactionReference());
    var fragment = document.createDocumentFragment();
    var firstLink;
    var i;

    appList.textContent = "";

    for (i = 0; i < UPI_APPS.length; i += 1) {
      var link = createAppLink(UPI_APPS[i], paymentQuery);
      if (!firstLink) firstLink = link;
      fragment.appendChild(link);
    }

    appList.appendChild(fragment);
    appPicker.hidden = false;
    launchStatus.textContent = "";

    window.setTimeout(function () {
      appPicker.scrollIntoView(true);
      if (firstLink) firstLink.focus();
    }, 0);
  }

  function hideAppChoices() {
    appPicker.hidden = true;
    launchStatus.textContent = "";
  }

  amountInput.addEventListener("input", function () {
    amountInput.value = sanitizeAmount(amountInput.value);
    validateAmount(submitAttempted);
    hideAppChoices();
  });

  descriptionInput.addEventListener("input", function () {
    descriptionInput.value = descriptionInput.value.replace(/[\r\n]+/g, " ");
    descriptionCount.textContent = descriptionInput.value.length;
    hideAppChoices();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitAttempted = true;

    if (!validateAmount(true)) {
      amountInput.focus();
      return;
    }

    renderAppChoices();
  });

  editPaymentButton.addEventListener("click", function () {
    hideAppChoices();
    amountInput.focus();
  });

  var quickAmountButtons = document.querySelectorAll("[data-amount]");
  var i;

  for (i = 0; i < quickAmountButtons.length; i += 1) {
    quickAmountButtons[i].addEventListener("click", function () {
      amountInput.value = this.getAttribute("data-amount");
      validateAmount(false);
      hideAppChoices();
    });
  }

  validateAmount(false);
}());
