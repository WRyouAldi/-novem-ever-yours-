# Novem-ever Yours — Android

Android companion app for the live anniversary website.

- Website source of truth: https://wryoualdi.github.io/-novem-ever-yours-/
- Runtime: Expo SDK 58 + React Native WebView
- Network model: online; gallery, videos and letter load from the live website.
- App identity: winter editorial romance — ivory, muted winter blue and burgundy.

## Local setup

```bash
npm install
npx expo install --fix
npx expo start
```

The postinstall script generates launcher, adaptive launcher and splash PNGs from the editable SVG brand artwork in `assets/brand/`.

## APK

Link the project to an Expo account once:

```bash
npx --yes eas-cli@latest login
npx --yes eas-cli@latest init
npx --yes eas-cli@latest build -p android --profile preview
```

The `preview` profile produces an installable APK. Do not use the production profile for a public Play Store submission without configuring the store release separately.
