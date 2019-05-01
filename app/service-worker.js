console.log('Service-worker.js registered')

// Importing Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');


if (workbox) {
	console.log(`Yay! Workbox is loaded also 🎉`);
} else {
   	console.log(`Boo! Workbox didn't load 😬`);
}


// Enable Google Analytics
// workbox.googleAnalytics.initialize();


workbox.routing.registerRoute(
	// Cache JS files.
	/\.js$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'scripts-cache',
	})
);
  

workbox.routing.registerRoute(
	// Cache CSS files.
	/\.css$/,
	// Use cache but update in the background.
	new workbox.strategies.StaleWhileRevalidate({
		// Use a custom cache name.
		cacheName: 'css-cache',
	})
);


workbox.routing.registerRoute(
	// Cache image files.
	/\.(?:png|jpg|jpeg|svg|gif)$/,
	// Use the cache if it's available.
	new workbox.strategies.CacheFirst({
		// Use a custom cache name.
		cacheName: 'image-cache',
		plugins: [
			new workbox.expiration.Plugin({
				// Cache only 20 images.
				maxEntries: 20,
				// Cache for a maximum of a month.
				maxAgeSeconds: 30 * 24 * 60 * 60,
			})
		],
	})
);


// Dragula drag'n'drop library
workbox.routing.registerRoute(
	'https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.2/dragula.min.js',
	new workbox.strategies.StaleWhileRevalidate(),
);


// Knockoutjs MVVM library
workbox.routing.registerRoute(
	'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.0/knockout-min.js',
	new workbox.strategies.StaleWhileRevalidate(),
);


// Google Fonts
workbox.routing.registerRoute(
	// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
	/^https:\/\/fonts\.googleapis\.com/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets',
	})
);


workbox.routing.registerRoute(
	// Cache the underlying font files with a cache-first strategy for 1 year.
	/^https:\/\/fonts\.gstatic\.com/,
	new workbox.strategies.CacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new workbox.cacheableResponse.Plugin({
        		statuses: [0, 200],
    		}),
    		new workbox.expiration.Plugin({
        		maxAgeSeconds: 60 * 60 * 24 * 365,
        		maxEntries: 30,
     		}),
    	],
	})
);
  
  