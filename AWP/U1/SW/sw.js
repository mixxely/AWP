//nombre del cache actual (identificador unico)
const CACHE_NAME = 'mi-app-cache-v1';

//lista de los archivos que se van a guardar en el cache
const urlsToCache = [
    './',//la ruta raiz
    './index.html',//documento principal
    './style.css',//archivo de estilos
    './app.js',//script del cliente
    './logo.png'//imagen del logo
];
//evento de instalacion (se dispara cuando se instala el sw)
self.addEventListener('install', (event) => {
    console.log('SW: Instalado');

    //evento waitUntil() asegura que la instalacion espera hastga que se acompleta la promesa (promise) de cachear archivos
    event.waitUntil(
        caches.open(CACHE_NAME) .then((cache) => {
            console.log('SW:  Archivos cacheados');

        //cache.addAll() agrega todos los archivos de urlsToCache al cache
        return cache.addAll(urlsToCache);
        })
    );

    //mmostrar notificaion en sistema 
    self.registration.showNotification("Service Worker activo.", {
        body: "El cache inicial se configuro correctamente." ,
        icon: "logo.png"
    });
});
//eventos de activacion (se dispara cuando el sw toma contro)
self.addEventListener('activate', (event) => {
    console.log('SW: Activado');

    event.waitUntil(
        //caches.keys() obtiene todas las claves (nombres) de los caches existentes
        caches.keys().then((cacheNames) => {
            //promise que se resuelve cuando se eliminan los caches viejos
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Cache antiguo eliminado:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    )
});

//evento de intercepciones de peticiones cada vez que la pagina solicita un recurso
self.addEventListener('fetch', (event) => {
    event.respondWith(
        //caches.match() busca si el recurso ya esta en el cache
        caches.match(event.request).then((response) => {
            //si esta en cache se devuelve la copia guardada
            //si no esta el cache se hace la peticion a la red con fetch()
            return response || fetch(event.request);
        })
    );
});