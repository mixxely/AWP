//Registrar el SW
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("service-worker.js")
    .then((reg)=>console.log("Service worker registrado:", reg))
    .catch((err)=>console.log("Error al registrar el service Worker:", err));
}
//boton para verificar el estado del service worker
document.getElementById("check").addEventListener("click", ()=>{
    if (navigator.serviceWorker.controller) {
        alert("El service worker está activo y controlando esta pagina.");
    } else{
        alert("El service worker aun no esta activo");
    }
});
//solicitar permiso de notificación
if (Notification.permission==="default") {
    Notification.requestPermission().then((perm)=>{
        if (perm==="granted") {
            console.log("Permiso de notificaion concedido.");

        } else{
             console.log("Permiso de notificaion denegado.");
        }
    });
    
}
//boton para lanzar la notificaion  local
document.getElementById("btnNotificacion").addEventListener("click",()=>{
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("mostrar-notificacion");
        
    } else{
        console.log("El sw no esta activo aun");
    }
});