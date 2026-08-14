# NFC UPI Payment Portal

A static, mobile-first UPI handoff page for **Medhansh Khattar**. It does not process payments or collect a UPI PIN. It creates a UPI request with the visitor's chosen amount and opens their selected payment app.

## Live deployments

- GitHub Pages: `https://mendhivadi05-max.github.io/UPI-Pay/index.html`
- Vercel: [deploy this repository](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmendhivadi05-max%2FUPI-Pay&project-name=medhansh-upi-nfc) using the included `vercel.json`, then use the generated `.vercel.app` URL.

## Write the NFC tag

1. Erase all previous NDEF records from the tag.
2. Open **NFC Tools → Write → Add a record → Custom URL/URI**.
3. Paste exactly one deployed HTTPS URL—not the `github.com` repository URL.
4. Write and test the tag on more than one Android phone.
5. Make the tag read-only only after the complete flow works.

## Payment flow

1. The visitor taps the NFC tag.
2. The page opens and asks for an amount and an optional payment description.
3. The visitor explicitly chooses Google Pay, PhonePe, Paytm, FamApp, or BHIM.
4. Android opens the selected app with the payee, amount, description, and a unique transaction reference filled in.
5. The visitor verifies the details and enters their UPI PIN inside the UPI app.

## Limitations

- This page cannot verify whether a payment succeeded. Check the receiving bank or UPI app.
- App-specific launch behavior depends on Android and the installed UPI app version.
- The portal intentionally avoids a generic UPI launch because Android may send that directly to a saved default app.
- The explicit app picker is designed for Android; unsupported or missing apps are sent to their Play Store page.
- App choices are native intent links so Chrome and Samsung Internet treat the tap as a direct user gesture.
- Never add a UPI PIN, bank password, card PIN, or OTP field to this page.
