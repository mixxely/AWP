/* sw.js */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('v1')
      .then(cache => {
        cache.addAll([
          './',          // index.html
          './script.js', // main script
          './obj.png'    // local image
        ]);
        console.log("Assets cached.");
      })
      .catch(err => console.log("Could not cache."))
  );
});

self.addEventListener('fetch', event => {
  console.log("INTERCEPTED");

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        console.log("V1 The request:", event.request);
        console.log("V1 Got the response...", response);

        // Example 1: from cache or fetched if not
        return response || fetch(event.request);

        // Example 2, 3, 4, 5 están en comentarios en el artículo
      })
      .catch(err => {
        console.log("Could not find matching request.");
        return null;
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        keys.forEach(key => {
          if (key === 'v1') caches.delete(key);
        });
      })
  );
});
