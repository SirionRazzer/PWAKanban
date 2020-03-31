/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */
console.log('service-worker.js registered');

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

if (workbox) {
  console.log(`Yay! Workbox is loaded also 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// JQuery library
workbox.routing.registerRoute(
  'https://code.jquery.com/jquery-3.4.0.min.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// jQuery UI - Extension library
workbox.routing.registerRoute(
  'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// jQuery UI - Extension library - touch hack library
workbox.routing.registerRoute(
  'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// Knockoutjs MVVM library
workbox.routing.registerRoute(
  'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// Knockout - Sortable - Extension library
workbox.routing.registerRoute(
  'https://cdnjs.cloudflare.com/ajax/libs/knockout-sortable/1.1.1/knockout-sortable.min.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// Bootstrap UI library
workbox.routing.registerRoute(
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// Firebase SDK
workbox.routing.registerRoute(
  'https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js',
  new workbox.strategies.StaleWhileRevalidate(),
);

// Analytics SDK
workbox.routing.registerRoute(
  'https://www.googletagmanager.com/gtag/js?id=G-015ZZ5Y0C7',
  new workbox.strategies.StaleWhileRevalidate(),
);

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app.js",
    "revision": "7b2c223612f62713bb94a01c6038fdaa"
  },
  {
    "url": "bootstrap.min.css",
    "revision": "8fe70898895271ddc62823321011273a"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "b601f9c8605971ae9a877bc7fbe09653"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "358cc49ae8d739d975e34dc43bf10c5a"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "c06d7f4f4aca8caa8783e1181e4a9e53"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "8b3ab92cbf61607f5d5f5fb9820599e2"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "fbbb0230da177bb52f9237c33257e39a"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "79d797eeff43d58256d89398d7c8f09c"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "855d25ce9f0881cf196eacf81e22873e"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "24c70fd923864b2f5f485a2c733d8110"
  },
  {
    "url": "index.html",
    "revision": "71bac4bdbe0e48d748fcf6d2375ed230"
  },
  {
    "url": "main.css",
    "revision": "595e485899586a37c7619739b8d11810"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "1fbb3ef8e02e65b8c52920626e432269"
  },
  {
    "url": "package.json",
    "revision": "dc6478e0435e5097dc948e7ea899aaa5"
  },
  {
    "url": "README.md",
    "revision": "90113196a914283dd30547d40f5b1327"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
