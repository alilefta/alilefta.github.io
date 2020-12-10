// Method 1 Caching specific pages of the site

const cacheName = 'v1';

const cacheAssets =  [
	'index.html',
	'about.html',
	'/css/style.css',
	'/js/main.js'
];


// Call install Event

self.addEventListener('install', (e) => {
	console.log("Service Worker: installed");

	// Caching response 
	e.waitUntil(
		caches
			.open(cacheName)
			.then(cache =>{
				console.log('Service Worker: Caching File')
				cache.addAll(cacheAssets);
			})
			.then(()=> self.skipWaiting())
	);
});


self.addEventListener('activate', (e) => {
	console.log("Service Worker: Activated");
	// Remove Unwanted Caches
	e.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if(cache !== cacheName){
						console.log('Service Worker: clearing Old Cache');
						return caches.delete(cache);
					}
				})
			);
		})
	);
});


// Call fetch Event

self.addEventListener('fetch', (e)=>{
	console.log('Service Worker: fetching');
	e.respondWith(
		fetch(e.request).catch(() => caches.match(e.reuqest))
	)
})