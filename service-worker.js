const cacheName = 'converter-cache-v7';
const urlsToCache = [
    'index.html',
    'main.css',
    'https://free.currencyconverterapi.com/api/v5/currencies'
];

self.addEventListener('install', (event)=>{
    event.waitUntil(
        caches.open(cacheName)
        .then((cache)=>{
            return cache.addAll(urlsToCache);
        })
    );
});

// delete cache that is not being used
self.addEventListener('activate', (event)=>{
    event.waitUntil(
        caches.keys().then((names)=>{
            return Promise.all(
                names.filter((name)=>{
                    return name.startsWith('converter-') &&
                    name != cacheName;
                })
                .map((name)=>{
                    return caches.delete(name);
                })
            );
        })
    );
})

//serve or cache new items from the cache 
self.addEventListener('fetch', (event)=>{
    console.log(event.request);
    event.respondWith(
        caches.match(event.request)
        .then((response)=>{
            return response || fetchAndCache(event.request);
        })
    )
})

function fetchAndCache(url){
    return fetch(url)
        .then((response)=>{
            //check for valid response
            if(!response.ok){
                throw Error(response.statusText);
            }
            return caches.open(cacheName)
                .then((cache)=>{
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch((error)=>{
            console.log('Request failed:', error);
        });
}
