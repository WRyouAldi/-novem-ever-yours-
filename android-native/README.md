# D 27 Daisy — Native Android wrapper

A minimal Kotlin Android application that opens the live anniversary website in the Android System WebView. It does not migrate or bundle the website.

- Website: https://wryoualdi.github.io/-novem-ever-yours-/
- Application ID: `com.novem.ever.yours`
- Minimum Android: 6.0 (API 23)
- Native stack: Kotlin + Android WebView; no React Native or Expo runtime.
- Includes branded launcher icon, ivory/burgundy/sage loading state, retry screen, Android back navigation, and external-link handoff.

## Build

Requires JDK 17, Android SDK platform 35, and Gradle 8.11.1.

```bash
gradle assembleDebug assembleRelease
```

APK outputs:
- `app/build/outputs/apk/debug/app-debug.apk`
- `app/build/outputs/apk/release/app-release-unsigned.apk`

The `mobile/` Expo project is intentionally retained as a backup and is not part of this app's build.
