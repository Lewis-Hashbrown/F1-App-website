# F1 Schedule Widgets website

Static site for the F1 Schedule Widgets Android app. Netlify publishes this repo from GitHub on every push to `main`:
https://f1-schedule-widgets.netlify.app/

The Play Store listing links to `privacy-policy.html`, so keep that file name.

## Files

- `index.html` – home page. The hero widget shows the real next race in the visitor's time zone and cycles through themes.
- `privacy-policy.html` – privacy policy, including how to ask for data deletion (`#delete`).
- `terms.html` – free trial and theme purchase terms.
- `styles.css` – shared styles. Colours and panel shapes copy the app.
- `site.js` – widget demo, weekend timeline, calendar and theme wall.
- `races.js` – 2026 calendar in UTC, copied from the app's `F1Official2026Fetcher.kt`.
- `assets/art` – team and driver artwork from the app.
- `assets/frames` – theme stripes and corners, converted from the app's vector drawables to SVG.
- `assets/tracks` – circuit outlines from the app.
- `assets/screens` – app screenshots taken on an emulator.

## Updating

- **Calendar changes:** update `races.js` from the app's fetcher data.
- **New app screens:** replace the WebP files in `assets/screens`, keeping the names.
- **Privacy changes:** update `privacy-policy.html` and its "Last updated" date before the app change ships.

Preview locally with `python -m http.server 8765` in this folder, then open http://localhost:8765.
