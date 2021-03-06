![repository-welcome](https://user-images.githubusercontent.com/12099284/62224227-9c58dd00-b3b6-11e9-84d4-80b5ae9f9682.png)

# Kanban

PWA kanban board usable offline on any device with optional synchronization of board.
[NEW] You can synchronize your board across devices!

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

# Developer notes

* regenerate revision hashes for sw.js precacheManifest with Workbox manually
> workbox 
