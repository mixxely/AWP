//app principal 

let stream = null                     //Mediastream actual de la camara
let currentFacing = 'environment';   //camara activa user = frontal, environment = camara trasera
let mediaRecorder  = null;      //instancia de mediaecorder para audio
let chunks = [];      //buffers temporales de audio grabado
let beforeInstallEvent = null;   //evento diferido para mostrar el boton de instalacion

//Accesos rapidos al DOM
const $ = (sel) => document.querySelector(sel);
const video = $('#video');                 //Etiqueta video donde se muestra el stream
const canvas = $('#canvas');               //Etiqueta para capturar fotos canvas
const photos = $('#photos');               //contenedor de fotos capturadas
const audio = $('#audios');                //Contenedor de audios grabados
const btnStartCam = $('#btnStartCam');     //Boton para iniciar camara
const btnStopCam = $('#btnStopCam');       //Boton para parar camara
const btnFlip = $('#btnFlip');             //Boton para altenar camara
const btnTorch = $('#btnTorch');           //Boton linterna
const btnShot = $('#btnShot');             //Boton para tomar foto
const videoDevices = $('#videoDevices');   //Etiqueta select para las camaras disponibles
const btnStartRec = $('#btnStartRec');     //Inicializar grabacion de audio
const bntStopRec = $('#btnStopRec');       //boton para detener grabacion de audio
const recStatus = $('#recStatus');         //Indicador del estado de la grabacion
const btnInstall = $('#btnInstall');       //Boton para instalar la PWA

//Instalacion de la PWA (A2HS)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    beforeInstallEvent = e;
    if (btnInstall) btnInstall.hidden = false;
});

    btnInstall.addEventListener('click', async () => {
        if (!beforeInstallEvent) return;
        await beforeInstallEvent.prompt();
        try {
            await beforeInstallEvent.userChoice;
        } catch (err) {
            // ignore errors from prompt/user interaction
        }
        if (btnInstall) btnInstall.hidden = true;
        beforeInstallEvent = null;
    });

//camara: listado y control
async function listVideoInputs(){
    try {
        const devices  = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(d => d.kind === 'videoinput');

        videoDevices.innerHTML = '';
        cams.forEach((d, i) => {
            const opt = document.createElement('option');
            opt.value = d.deviceId;
            opt.textContent = d.label || `Camara ${i+1}`;
            videoDevices.appendChild(opt);
        });
    } catch (err){
        console.warn ('No se pudo enumerar dispositivos.', err);
    }
}


async function StartCam(constraints = {}) {
    if (! ('mediaDevices' in navigator )) {
        alert ('Este navegador no soporta el acceso a la camra/microfono.');
        return;
    }
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacing, ...constraints},
            audio: false
        });

        //Enlazar el stream al video para previsualizar
        video.srcObject = stream;

        //Habilita controles relacionados
        btnStopCam.disabled = false;
        btnShot.disabled = false;
        btnFlip.disabled = false;
        btnTorch.disabled = false;
        
        //Actualiza el listados de camaras disponibles
        await listVideoInputs();
    } catch (err){
        alert('No se pudo acceder a la camara: ' + err.message);
        console.error(err);
    }
}

//Funcion stopCam 
function stopCam() {
    //Detiene todas las pistas de stream activo (libera la camra)
    if (stream) { stream.getTracks().forEach(t => t.stop()); }
    stream = null;
    video.srcObject =  null;

    //Desabilita controles de camara 
    btnStopCam.disabled = true;
    btnShot.disabled = true;
    btnFlip.disabled = true;
    btnTorch.disabled = true;
}

//Botones de control de camara 
btnStartCam.addEventListener('click', () => StartCam());
btnStopCam.addEventListener('click', stopCam);

btnFlip.addEventListener('click', async () => {
    //Alterna entre camara frontal y trasera y reincia el stream
    currentFacing = (currentFacing === 'enviroment') ? 'user' : 'enviroment';
    stopCam();
    await StartCam();
})

videoDevices.addEventListener('change', async (e) => { //cambie de changed a change
    //cambia el deviceID especifico elegido en el select
    const id =e.target.value;
    stopCam();
    await StartCam({deviceId: {exact: id} });
});

btnTorch.addEventListener('click', async () => {
    //algunas plataformas permiten activar la linterna con applyConstraints
    try{
        const [track] = stream ? stream.getVideoTracks() : [];
        if (!track) return;
        const cts = track.getConstraints();

        //alterna el estado de torch de forma simple con naive toggle
        const torch = !(cts.advanced && cts.advanced[0]?.torch);
        await track.applyConstraints({ advanced: [{ torch }] });

    } catch (err) {
        alert('La linterna no es compatible en este dispositivo o navegador.');
    }
});