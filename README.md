# NFC UPI Payment Portal

A static, mobile-first UPI handoff page for **Medhansh Khattar**. It does not process payments or collect a UPI PIN. It creates a UPI request with the visitor's chosen amount and opens their selected payment app.

## Publish with GitHub Pages

1. Create a new public GitHub repository.
2. Upload `index.html` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then save.
6. GitHub will provide an HTTPS URL such as `https://username.github.io/repository/`.

## Write the NFC tag

1. Open **NFC Tools → Write → Add a record → Custom URL/URI**.
2. Paste the published HTTPS URL.
3. Write and test the tag on more than one Android phone.
4. Make the tag read-only only after the complete flow works.

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
- Never add a UPI PIN, bank password, card PIN, or OTP field to this page.
