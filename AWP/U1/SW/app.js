//verificar si el navegador soporta el sw
if ("serviceWorker" in navigator) {

    //el metodo register sirve para registrar un archivo tipo servirce worker
    //el parametro "./sw.js es la ruta del archivo para usar como SW"
    navigator.serviceWorker
        .register("./sw.js")
        //then() se ejecuta si en service worker fue exitoso
        //'reg' es un objeto de tipo service worker registration con informacion del SW
        .then((reg)=>console.log("Service Worker registrado:",reg))
        //catch () se ejecuta si ocurre un error en el registro 
        //'err' coontiene  el mensaje o detalle del error

        .catch((err)=> console.log("Error al registrar el SW:" , err));


}

//agregamos un evento de click para el id check
document.getElementById("check").addEventListener("click", () =>{
    //verificar si el sw controla la pagina actual 
    if (navigator.serviceWorker.controller) {
        alert("El service worker está activo y controlando la pagina");
        
    } else{
        alert("El service worker aún no está activo.");
    }
});


//Area de notificación 
if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
            console.log("Permiso de Notificación concedido.")
        }
    });
}