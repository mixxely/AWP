// main.js
// Registro del Service Worker y manejo de permiso de notificaciones

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => console.log('Service Worker registrado:', reg))
    .catch(err => console.error('Error al registrar el SW:', err));
}


// Botón (user gesture) para solicitar permiso y pedir mostrar notificación
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnNotificaciones');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    // Pedir permiso solo con acción del usuario
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta Notificaciones Web.');
      return;
    }

    // Si estado default, pedir permiso
    if (Notification.permission === 'default') {
      try {
        const permiso = await Notification.requestPermission();
        if (permiso !== 'granted') {
          alert('Permiso de notificaciones no concedido.');
          return;
        }
      } catch (err) {
        console.error('Error pidiendo permiso:', err);
        return;
      }
    }

    if (Notification.permission === 'granted') {
      // Esperar a que el SW esté activo
      const swReady = await navigator.serviceWorker.ready;

      // Enviar mensaje al SW para que muestre la notificación con showNotification()
      // Usamos postMessage para que la notificación la gestione el SW (aparece en la barra de Windows)
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'MOSTRAR_NOTIFICACION',
          title: '¡Gracias por visitar la Fan Page de Sir Chloe!',
          options: {
            body: '¡Explora el sitio!',
            icon: './img/logo.png',
            tag: 'sw4-welcome'
          }
        });
      } else {
        // fallback: usar showNotification vía registration si no hay controller
        swReady.showNotification('¡Gracias por visitar Sir Chloe!', {
          body: 'Explora el sitio!',
          icon: './img/logo.png',
          tag: 'sw4-welcome'
        });
      }
    } else {
      alert('Las notificaciones no están permitidas.');
    }
  });
});
