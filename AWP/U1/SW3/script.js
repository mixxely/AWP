let registration = null;

function register_service_worker() {
  if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js", { scope: "./" })
    .then(res => {
      console.log("SW Registrado exitosamente.");
    })
    .catch(err => {
      console.log("No se pudo registrar el service worker.", err);
    });
}
}

function unregister_service_worker() {
  navigator.serviceWorker.getRegistrations()
    .then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log("Service Worker no registrado.");
      });
    })
    .catch(err => {
      console.log("No se pudo cancelar el registro del service worker.");
    });
}

window.addEventListener('click', () => {
  fetch('./obj.png')
    .then(res => console.log('Del script.js:', res));
});

register_service_worker();

