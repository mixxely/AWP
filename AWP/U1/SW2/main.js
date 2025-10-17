// Registrar el SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then((reg) => console.log("Service worker registrado:", reg))
        .catch((err) => console.log("Error al registrar el service Worker:", err));
}

// Botón para verificar el estado del service worker
document.getElementById("check").addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
        alert("El service worker está activo y controlando esta página.");
    } else {
        alert("El service worker aún no está activo");
    }
});

// Botón para lanzar la notificación local
document.getElementById("btnNotificacion").addEventListener("click", async () => {
    // Esperar a que el SW esté activo
    if (!navigator.serviceWorker.controller) {
        console.log("Esperando a que el SW se active...");
        await navigator.serviceWorker.ready;
    }

    // Pedir permiso de notificación (solo cuando el usuario hace clic)
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
        navigator.serviceWorker.controller?.postMessage("mostrar-notificacion");
    } else {
        alert("Debes permitir las notificaciones para poder verlas.");
    }
});
