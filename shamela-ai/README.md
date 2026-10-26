# Shamela AI PWA wrapper

Published path (after GitHub Pages deployment):
https://teguhsulistyawan.github.io/shamela-ai/

This is a PWA shell that embeds the official `https://shamela.ws/ai` service in an iframe. It does not copy or host Shamela's AI, books, database, API, or authentication backend.

## Install
- Desktop Chrome/Edge: open the published URL and use the install icon in the address bar or browser menu if available.
- Android Chrome: open the published URL, then browser menu > Install app / Add to Home screen.

## Important limitation
The PWA wrapper only works as a full in-app view if `shamela.ws` permits third-party framing and the browser permits the required session cookies and authentication. If the official site blocks iframes via `Content-Security-Policy: frame-ancestors` or `X-Frame-Options`, this project cannot override that server policy. Google/Apple login can also be blocked in embedded frames by their security policies. Use the official-site link if the embedded view fails.

The service worker caches the wrapper shell only; it does not cache or pretend to provide offline access to Shamela's server-side AI.
