let temperatura=380;
let encendido = false;
let agua = 70;
let velocidad = 1;

const alarma = document.getElementById("alarma");
alarma.volume = 0.2;
let alarmaActiva = false;

setInterval(() => {
    temperatura+= velocidad;
    controlarAlarma();
     document.getElementById("temperatura").innerText = temperatura + "°C";
    },1000 ); 
    setInterval(() => {
    if (temperatura > 400) {
        document.getElementById("temperatura").style.color = "red";
        const overlay = document.getElementById("overlay");
        overlay.style.opacity = "0.3";
        setTimeout(() => {
            overlay.style.opacity = "0";
        },500);

    } else {
        document.getElementById("overlay").style.opacity = "0";
        document.getElementById("temperatura").style.color = "white";
    }
}, 2000);


let motorEnviar = null;
let motorDesfogar = null;
const btnagua = document.querySelector(".btnagua");
const btndesfogar = document.querySelector(".btndesfogar");

function actualizar() {
    document.getElementById("temperatura").innerText =
        Math.round(temperatura) + "°C";

    document.getElementById("agua").innerText =
        Math.floor(agua) + "%";
    document.getElementById("barraAgua").style.width = agua + "%";
}



function iniciarEnviar() {
    motorEnviar = setInterval(() => {
        if (agua >= 100) {
            agua = 100;
            temperatura=temperatura;
            if(temperatura<=0){
                temperatura = 0;
            }
        }
        else {
        agua += 1;
        temperatura -= 1.5;
        velocidad = 0;
        }

        actualizar();
    }, 200);
}

function pararEnviar() {
    clearInterval(motorEnviar);
}

function desfogar() {
    motorDesfogar = setInterval(() => {
        if (agua <= 0) {
            agua = 0;
            temperatura=temperatura;
                if(temperatura<=0){
                    temperatura = 0;
                }
        }
        else {
        agua -= 2;
        temperatura -= 0.25;
        velocidad = 0;
        }   
        actualizar();
    },150);
}
function pararDesfogar() {
    clearInterval(motorDesfogar);
}
function controlarAlarma() {

    if (temperatura > 400) {

        if (!alarmaActiva) {
            alarma.play();
            alarma.loop = true;
            alarmaActiva = true;
        }

    } else {

        alarma.pause();
        alarma.currentTime = 0;
        alarmaActiva = false;
    }
}

btnagua.addEventListener("mousedown", iniciarEnviar);
btnagua.addEventListener("mouseup", pararEnviar);
btnagua.addEventListener("mouseleave", pararEnviar);

btndesfogar.addEventListener("mousedown", desfogar);
btndesfogar.addEventListener("mouseup", pararDesfogar);
btndesfogar.addEventListener("mouseleave", pararDesfogar);
setInterval(()=> {
    if(agua<30){
    velocidad = 3;
}
else if(agua<50){
    velocidad = 2.5;
}
else if(agua<=70){
    velocidad = 2;
}
else{
    velocidad = 1;
}
},1000)

let tiempo = 30;
let iniciar=false;
setInterval(() => {
 if(temperatura > 400){
    iniciar = true;
 }
}, 1000);


setInterval(() => {
    if(iniciar){
        if(tiempo <= 0){
            tiempo = 0;
            document.getElementById("tiempo").innerText = "0s";
        }
        else{
        tiempo--;
        document.getElementById("tiempo").innerText = tiempo + "s";
        }
    }}, 1000);
let energia = 850;
let energiaActiva = false;
let intervaloEnergia = null;
setInterval(() => {
    if (temperatura > 400) {
        if (!energiaActiva) {
            energiaActiva = true;
            iniciarSubidaEnergia();
        }
    } else {
        energiaActiva = false;
    }
}, 1000);

function iniciarSubidaEnergia() {
     if (intervaloEnergia !== null) return;

    intervaloEnergia = setInterval(() => {
        energia += 5; // velocidad de crecimiento

        document.getElementById("energia").innerText =
            energia ;
        if (energia > 1200) {
            energia = 1200; // límite del sistema
        }
    }, 1000);
}

