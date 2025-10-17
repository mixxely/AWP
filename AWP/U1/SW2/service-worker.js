//Nombre del cache
const cacheName="mi-cache-v2";

//archivos que se guardaran en cache
const cacheAssets=[
    'index.html',
    'pagina1.html',
    'pagina2.html',
    'offline.html',
    'style.css',
    'main.js',
    'logo.png'
];

//instalacion de sw 
self.addEventListener('install', (event)=>{
    console.log('SW:Instalado');
    event.waitUntil(
        caches.open(cacheName).then((cache)=>{
            console.log('SW_Cacheando archivos ...');
            return cache.addAll(cacheAssets);
        
        })
        .then(()=> self.skipWaiting())
        .catch((err)=> console.log('Error al cahear archivos.',
            err ))
    );
});

//activacion del sw

self.addEventListener('activate', (event)=>{
    console.log('SW:Activado');
    event.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(
                cacheNames.map((cache)=>{
                    if(cache!== cacheName){
                        console.log(`SW:eliminando cache antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

//Escuchar mensajes desde la pagina

self.addEventListener('message', (event)=>{
    console.log('SW recibió:', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificacion local.'
            ,{
                body:'Esta es una prueba de notificacion sin servidor push.',
                icon:'logo.png'
            });
    }
});

//manejar peticiones de red con fallback offline
self.addEventListener('fetch',(event)=>{
    //ignorar peticiones innecesarias como extenciones o favicon
if (event.request.url.includes('chrome-extension') ||
event.request.url.includes('favicon.ico')
) {
    return;
    
}
event.respondWith(
    fetch(event.request)
    .then((response)=>{
        //si la respuesta es valida la devuelve y la guarda en cahe dinamico
        const clone = response.clone();
        caches.open(cacheName).then((cache)=> cache.put (event.request, clone));
        return response;

    })
    .catch(()=>{
        //si no hay red buscar en cache
        return caches.match(event.request).then((response)=>{
            if (response) {
                console.log('SW:Recurso desde la cache', event.request.url);
                return  response;
            } else{
                console.warn('SW:Mostrar página offline');
                return caches.match('offline.html');
            }
        });
    })
);

});
