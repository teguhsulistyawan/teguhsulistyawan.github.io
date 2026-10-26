# Shamela AI Android

A small Android WebView app that opens https://shamela.ws/ai in a dedicated app window without Chrome's address bar.

## Build

GitHub Actions builds a signed debug APK automatically. The APK is signed with Gradle's standard debug key and is suitable for personal installation/testing.

## Known limitation

The Shamela website is operated by a third party. Sign-in providers such as Google may block authentication inside Android WebView. The app does not bypass those provider policies; if sign-in fails, use the official site in Chrome. No Shamela credentials are collected by this wrapper.

## Privacy and security

The app loads only network pages in WebView, allows no cleartext HTTP traffic, and adds no JavaScript-to-native bridge.
