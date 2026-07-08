let temperatura = 380;
let encendido = false;
let agua = 70;
let calorgenerado = 1;
let enfriamiento = 0;

let reactorDetenido = false;
let emergenciaActivada = false;
let sistemaDetenido = false;
let turbinasDetenidas = false;
let ventilacionRealizada = false;
let aguaEnviada = false;
let desfogueRealizado = false;
let reactorApagado = false;
let exitoReproducido = false;

const alarma = document.getElementById("alarma");
alarma.volume = 0.5;
const errorAudio = document.getElementById("errorAudio");
errorAudio.volume = 0.5;
const successAudio = document.getElementById("successAudio");
successAudio.volume = 0.4;

setInterval(() => {

    if (!reactorDetenido) {
        temperatura += calorgenerado - enfriamiento;
        console.log("Temperatura actual:", temperatura);    
    } 
    else {
        // reactor apagado: deja de generar calor
        temperatura -= enfriamiento;
    }

    if (temperatura < 0) {
        temperatura = 0;
    }

    actualizar();
    actualizarEnergia();

},1000);
    setInterval(() => {
    if (alarmaIniciada) {
        
        const overlay = document.getElementById("overlay");
        overlay.style.opacity = "0.3";
        setTimeout(() => {
            overlay.style.opacity = "0";
        },500);

    } else{
        document.getElementById("overlay").style.opacity = "0";
    } 
    if(temperatura>400){
        document.getElementById("temperatura").style.color = "red";
        
    }else{
        document.getElementById("temperatura").style.color = "white";
    }
}, 1000);


let motorEnviar = null;
let motorDesfogar = null;
const btnagua = document.querySelector(".btnagua");
const btndesfogar = document.querySelector(".btndesfogar");
const btnemer = document.querySelector(".btnemer");

function actualizar() {
    document.getElementById("temperatura").innerText =
        Math.round(temperatura) + "°C";

    document.getElementById("agua").innerText =
        Math.floor(agua) + "%";
    document.getElementById("barraAgua").style.width = agua + "%";
    actualizarAlerta();
}



function iniciarEnviar() {
    motorEnviar = setInterval(() => {

        if (agua >= 100) {
            agua = 100;
        } else {
            agua += 1;
        }

       temperatura -= 1;
       calorgenerado = 0.8;

        actualizar();

    }, 200);
}

function pararEnviar() {
    clearInterval(motorEnviar);
}
function desfogar() {

    motorDesfogar = setInterval(() => {

        desfogueRealizado = true;
        if (agua <= 0) {
            agua = 0;
        } else {
            agua -= 2;
        }

        temperatura -= 0.5;
        calorgenerado = 0.5;
        actualizar();

    }, 150);
}
setInterval(() => {
    if (calorgenerado < 1) {
        calorgenerado += 0.05;
    }
}, 5000);
function pararDesfogar() {
    clearInterval(motorDesfogar);
}

let alarmaIniciada = false;
setInterval(() => {

    if (temperatura > 400 &&
    !alarmaIniciada &&
    !sistemaDetenido &&
    !accidente) {
console.log("Se activó la alarma");
        alarmaIniciada = true;

        alarma.loop = true;
        alarma.play();
        iniciarTemporizador();
        actualizarPasos();  

    }

}, 1000);



btnagua.addEventListener("mouseup", pararEnviar);
btnagua.addEventListener("mouseleave", pararEnviar);



btndesfogar.addEventListener("mouseup", pararDesfogar);
btndesfogar.addEventListener("mouseleave", pararDesfogar);

const btnturbina = document.querySelector(".btnturbina");
const btnventilacion = document.querySelector(".btnventilar");
const btnapagar = document.querySelector(".btnapagar");


btnturbina.addEventListener("click", () => {

    turbinasDetenidas = true;
    verificarSistema();
    actualizarPasos();

});

btnventilacion.addEventListener("click", () => {

    if (sistemaDetenido) {
        return;
    }
    if (siguientePaso() !== "ventilacion") {
        mostrarError("Primero debe detener las turbinas");
        return;
    }

    ventilacionRealizada = true;
    verificarSistema();
    actualizarPasos();

});

btndesfogar.addEventListener("mousedown", () => {

    
    if (!turbinasDetenidas) {
        mostrarError("Primero debe detener las turbinas");
        return;
    }

    if (!ventilacionRealizada) {
        mostrarError("Primero debe ventilar el contenido radioactivo");
        return;
    }

    if (!desfogueRealizado) {
        desfogueRealizado = true;
        actualizarPasos();
    }

    desfogar();

});

btnagua.addEventListener("mousedown", () => {

    
    if (!turbinasDetenidas) {
        mostrarError("Primero debe detener las turbinas");
        return;
    }

    if (!ventilacionRealizada) {
        mostrarError("Primero debe ventilar el contenido radioactivo");
        return;
    }

    if (!desfogueRealizado) {
        mostrarError("Primero debe evacuar el agua caliente");
        return;
    }

    if (!aguaEnviada) {
        aguaEnviada = true;
        actualizarPasos();
    }

    iniciarEnviar();

});

btnapagar.addEventListener("click", () => {

    if (sistemaDetenido) {
        return;
    }
    if (siguientePaso() !== "reactor") {

        switch (siguientePaso()) {

            case "turbinas":
                mostrarError("Primero debe detener las turbinas");
                break;

            case "ventilacion":
                mostrarError("Primero debe ventilar el contenido radioactivo");
                break;

            case "desfogue":
                mostrarError("Primero debe evacuar el agua caliente");
                break;

            case "agua":
                mostrarError("Primero debe ingresar agua fría");
                break;
        }

        return;
    }

    reactorDetenido = true;
    reactorApagado = true;
    actualizarPasos();

});

btnemer.addEventListener("click", () => {

    if (siguientePaso() !== "emergencia") {

        switch (siguientePaso()) {

            case "turbinas":
                mostrarError("Primero debe detener las turbinas");
                break;

            case "ventilacion":
                mostrarError("Primero debe ventilar el contenido radioactivo");
                break;

            case "desfogue":
                mostrarError("Primero debe evacuar el agua caliente");
                break;

            case "agua":
                mostrarError("Primero debe ingresar agua fría");
                break;

            case "reactor":
                mostrarError("Primero debe apagar el reactor");
                break;
        }

        return;
    }

    emergenciaActivada = true;
    detenerSistema();

});

let tiempo = 30;
let temporizadorActivo = false;
let accidente = false;
let intervaloTiempo = null;
setInterval(() => {
 if(temperatura > 400){
    iniciar = true;
 }
}, 1000);
function iniciarTemporizador(){

    if(intervaloTiempo !== null) return;

    temporizadorActivo = true;

    intervaloTiempo = setInterval(()=>{

        if(tiempo > 0){

            tiempo--;

            document.getElementById("tiempo").innerText =
                tiempo + "s";

        }
        else{

            accidente = true;
            temporizadorActivo = false;
            sistemaDetenido = true;
                reactorDetenido = true;

            clearInterval(intervaloTiempo);

            document.getElementById("tiempo").innerText =
                "FALLO";

            mostrarError(
                "Tiempo agotado: no se completó la detención"
            );
// Apagar alarma
alarma.pause();
alarma.currentTime = 0;
alarma.loop = false;
alarmaIniciada = false;

const explosion = document.getElementById("explosion");
const sonidoExplosion = document.getElementById("explosionAudio");

// Reproducir explosión
sonidoExplosion.play();

// Comenzar el efecto visual
explosion.style.opacity = "1";

// Mostrar mensaje cuando termine el efecto
setTimeout(() => {

    explosion.innerHTML = `
        <div>
            ☢<br><br>
            ACCIDENTE NUCLEAR<br><br>
            La secuencia de apagado<br>
            no fue completada.
        </div>
    `;

}, 5000);

        }

    },1000);

}


let energia = 850;


function actualizarEnergia(){

    if(reactorDetenido){

        if(energia > 0){
            energia -= 50;
        }

        if(energia < 0){
            energia = 0;
        }

    } else {

        energia = 850 + ((temperatura - 380) * 10);

        if(energia < 0){
            energia = 0;
        }

    }


    document.getElementById("energia").innerText =
        Math.round(energia);

}


function iniciarSubidaEnergia() {
     if (intervaloEnergia !== null) return;
    console.log("Energia:", energia);
    intervaloEnergia = setInterval(() => {
        energia += 5; // velocidad de crecimiento

        document.getElementById("energia").innerText =
            energia ;
        if (energia > 1200) {
            energia = 1200; // límite del sistema
        }
    }, 1000);
}

let integridad = 100;
let deterioroActivo = false;
setInterval(() => {

    if (temperatura > 400 && !deterioroActivo) {

        deterioroActivo = true;
        iniciarDeterioro();

    }

}, 1000);
function iniciarDeterioro() {

    const intervaloIntegridad = setInterval(() => {

        // Si el sistema ya fue detenido, deja de deteriorarse
        if (sistemaDetenido) {
            clearInterval(intervaloIntegridad);
            return;
        }

        // Baja más rápido
        integridad -= 2.5;

        if (integridad < 0) {
            integridad = 0;
        }

        actualizarIntegridad();

    }, 1000);

}



function verificarSistema() {

    if (
        turbinasDetenidas &&
        ventilacionRealizada &&
        reactorApagado &&
        temperatura < 400 &&
        agua >= 50 &&
        agua <= 90
    ) {

        alarma.pause();
        alarma.currentTime = 0;
        alarmaIniciada = false;

    }

}

function actualizarIntegridad() {

    document.getElementById("integridadTexto").innerText =
        Math.round(integridad) + "%";

    const barra = document.getElementById("barraIntegridad");

    barra.style.width = integridad + "%";

    if(integridad > 60){
        barra.style.background = "lime";
    }
    else if(integridad > 30){
        barra.style.background = "orange";
    }
    else{
        barra.style.background = "red";
    }
}
function actualizarPasos() {

    if (!alarmaIniciada && !emergenciaActivada) {
    document.getElementById("pasosSistema").innerHTML =
        "Nada que reportar";
    return;
}

    if (!turbinasDetenidas) {
        document.getElementById("pasosSistema").innerHTML =
            "DETENER TURBINAS";
    }

    else if (!ventilacionRealizada) {
        document.getElementById("pasosSistema").innerHTML =
            "VENTILAR CONTENIDO<br>RADIOACTIVO";
    }

    else if (!aguaEnviada || !desfogueRealizado) {
        document.getElementById("pasosSistema").innerHTML =
            "EVACUAR AGUA CALIENTE<br>E INGRESAR AGUA FRÍA";
    }

    else if (!reactorApagado) {
        document.getElementById("pasosSistema").innerHTML =
            "APAGAR REACTOR";
    }

    else if (!emergenciaActivada) {
        document.getElementById("pasosSistema").innerHTML =
            "PRESIONAR BOTÓN<br>DE EMERGENCIA";
    }

    else {
        document.getElementById("pasosSistema").innerHTML =
            "<span style='color:lime;'>✓ PROCEDIMIENTO COMPLETADO</span>";
    }
}
function mostrarError(mensaje) {

    let error = document.getElementById("mensajeError");

    // Reiniciar el sonido por si ocurre otro error seguido
    errorAudio.pause();
    errorAudio.currentTime = 0;
    errorAudio.play();

    error.innerHTML = mensaje;
    error.style.color = "red";

    setTimeout(() => {
        error.innerHTML = "";
    }, 3000);

}
function detenerSistema(){
    sistemaDetenido = true;
    // Detener generación
    reactorDetenido = true;
    calorgenerado = 0;
    // Enfriamiento del sistema
    enfriamiento = 5;
    clearInterval(intervaloTiempo);
temporizadorActivo = false;
    // Energía a cero
    energia = 0;
    document.getElementById("energia").innerText = "0";

    
    // Apagar alarma
    alarma.pause();
    alarma.currentTime = 0;
    alarmaIniciada = false;

    // Reproducir sonido de éxito
   if(!exitoReproducido){
    exitoReproducido=true; 

    successAudio.currentTime = 0;
    successAudio.play();
   }

    // Quitar alerta visual
    document.getElementById("overlay").style.opacity = "0";

    alarmaIniciada = false;
    actualizarPasos();

}
function siguientePaso() {

    if (!turbinasDetenidas)
        return "turbinas";

    if (!ventilacionRealizada)
        return "ventilacion";

    if (!desfogueRealizado)
        return "desfogue";

    if (!aguaEnviada)
        return "agua";

    if (!reactorApagado)
        return "reactor";

    return "emergencia";
}
function actualizarAlerta() {

    let alerta = document.getElementById("estadoAlerta");

    if (accidente) {
        alerta.innerText = "ACCIDENTE NUCLEAR";
        alerta.style.color = "white";
    }
    else if (temperatura > 400) {
        alerta.innerText = "CRÍTICA";
        alerta.style.color = "red";
    }
    else {
        alerta.innerText = "NORMAL";
        alerta.style.color = "lime";
    }

}
