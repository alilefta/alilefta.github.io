// Method 2: Caching whole site

const cacheName = 'v2';

// Call install Event

self.addEventListener('install', (e) => {
	console.log("Service Worker: installed");
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
		fetch(e.request)
		.then(res => {
			// Make copy/clone of response
			const resClone = res.clone();

			// open cache
			caches
				.open(cacheName)
				.then(cache => {

					// Add response to cache
					cache.put(e.request, resClone)
				});
				return res;
		}).catch((err)=> caches.match(e.request).then(res=> res))
	);
})
