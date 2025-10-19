/* sw.js */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('v1')
      .then(cache => {
        console.log("Almacenando recursos en cache...");
        return cache.addAll([
          './',          // index.html
          './script.js', // main script
          './obj.png'    // local image
        ]);
      })
      .then(() => console.log("Recursos de cache almacenados."))
      .catch(err => console.log("No se pudo almacenar el cache.", err))
  );
});

self.addEventListener('fetch', event => {
  console.log("INTERCEPTADO");
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        console.log("V1 Petición detectada:", event.request);
        console.log("V1 Respuesta obtenida...", response);
        return response || fetch(event.request);
      })
      .catch(err => {
        console.log("No se encontró ninguna solicitud  que coincida.", err);
        return null;
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = ['v1'];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log("Borrando cache viejo:", key);
            return caches.delete(key);
          }
        })
      ))
  );
});

