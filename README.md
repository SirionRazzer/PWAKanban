# PWAKanban

PWA kanban board usable offline on any device.

Check the demo below.
IMPORTANT: Demo below won't start service-worker.js due to Github Pages restriction.
[-> Check it out!](https://sirionrazzer.github.io/PWAKanban/)

# Core PWA components

* manifest.webmanifest
* service-worker.js
* localStorage

# Technologies used

* MVVM bindings between JS and HTML with [Knockout](http://knockoutjs.com/)
* and Knockout extension [sortable](https://github.com/rniemeyer/knockout-sortable)
* Code check with [Lighthouse](https://github.com/GoogleChrome/lighthouse)
* PWA library [Workbox](https://developers.google.com/web/tools/workbox/)
* [Manifest generator](https://app-manifest.firebaseapp.com/)
* Bootstrap 4
* jQuery UI

# Move to other domain

* change "start_url" and "scope" in manifest.webmanifest (for example "/" is used if web is placed like https://example.com/index.html)