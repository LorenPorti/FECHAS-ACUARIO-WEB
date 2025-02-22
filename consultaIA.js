import { mostrarAlerta } from "./misFunciones.js";

// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));

// Insertar el título del acuario en la cabecera
document.getElementById("titulo-acuario").classList.add("text-truncate");
document.getElementById("titulo-acuario").innerHTML = `<span class="emoji">🤖</span>${dataConfig.nombreDelAcuario}`;

// Referencia al modal y su cuerpo
const modal = document.getElementById("modalConsultaIA");
const modalTitulo = document.getElementById("modalTitulo");
const modalCuerpo = document.getElementById("modalCuerpo");
const modalBootstrap = new bootstrap.Modal(modal);

console.log(dataConfig);
console.log(datosAcuario);

// Función para generar el texto de consulta basado en los últimos datos y todos los datos
function generarTextoConsulta(tipo) {
    let textoConsulta = "";
    let indice = datosAcuario.length - 1;

    if (tipo === "ultimos") {
        // Aquí generas el texto con los datos de la última semana
        modalTitulo.textContent = "Consulta usando últimos datos:";
        modalTitulo.classList.add("georgia-bold-italic");

        textoConsulta = 'Aquí están los valores registrados en mi acuario la última semana. La medición la he hecho el domingo:';

        textoConsulta += `<br><br>👉Acuario: ${dataConfig.largoAcuario} x ${dataConfig.anchoAcuario} x ${dataConfig.altoAcuario} cms<br>`;
        textoConsulta += `${dataConfig.filtros === "" ? "" : `👉Filtros: ${dataConfig.filtros}`}`;
        textoConsulta += `<br>${dataConfig.calentadores === "" ? "" : `👉Calentadores: ${dataConfig.calentadores}`}`;
        textoConsulta += `<br>${dataConfig.refrigeracion === "" ? "" : `👉Enfriamiento: ${dataConfig.refrigeracion}`}`;
        textoConsulta += `<br>${dataConfig.otros === "" ? "" : `👉Otros elementos: ${dataConfig.otros}`}`;
        // textoConsulta += `<br>👉El pH es ${datosAcuario[indice].pH.toFixed(1).toString().replace(".", ",")} (${datosAcuario[indice].pH > datosAcuario[indice-2].pH ? "subiendo":"bajando"}); el pH óptimo o deseable es ${dataConfig.pHOpt.toFixed(1).toString().replace(".", ",")}.`;
        textoConsulta += `
        <br>👉El pH es ${datosAcuario[indice].pH.toFixed(1).toString().replace(".", ",")} (${datosAcuario[indice].pH > datosAcuario[indice-2].pH ? "subiendo" : datosAcuario[indice].pH < datosAcuario[indice - 2].pH ? "bajando" : "estable"}); el pH óptimo o deseable es ${dataConfig.pHOpt.toFixed(1).toString().replace(".", ",")}.
        `;
        // textoConsulta += `<br>👉El KH es ${datosAcuario[indice].KH.toFixed(1).toString().replace(".", ",")} (dKH) (${datosAcuario[indice].KH > datosAcuario[indice-2].KH ? "subiendo":"bajando"}); el KH óptimo o deseable es ${dataConfig.KHOpt.toFixed(1).toString().replace(".", ",")} (dKH).`;
        textoConsulta += `
        <br>👉El KH es ${datosAcuario[indice].KH.toFixed(1).toString().replace(".", ",")} (dKH) (${datosAcuario[indice].KH > datosAcuario[indice-2].KH ? "subiendo" : datosAcuario[indice].KH < datosAcuario[indice - 2].KH ? "bajando" : "estable"}); el KH óptimo o deseable es ${dataConfig.KHOpt.toFixed(1).toString().replace(".", ",")} (dKH).
        `;
        // textoConsulta += `<br>👉El NO3 es ${datosAcuario[indice].NO3} (ppm) (${datosAcuario[indice].NO3 > datosAcuario[indice-2].NO3 ? "subiendo":"bajando"}).`;
        textoConsulta += `
        <br>👉El NO3 es ${datosAcuario[indice].NO3.toFixed(1).toString().replace(".", ",")} (ppm) (${datosAcuario[indice].NO3 > datosAcuario[indice-2].NO3 ? "subiendo" : datosAcuario[indice].NO3 < datosAcuario[indice - 2].NO3 ? "bajando" : "estable"}).
        `;
        // textoConsulta += `<br>👉La temperatura es ${datosAcuario[indice].temp.toFixed(0).toString()} (ºC) (${datosAcuario[indice].temp > datosAcuario[indice-2].temp ? "subiendo":"bajando"}); la temperatura óptima o deseable es ${dataConfig.tempOpt.toFixed(0).toString()} (ºC).`;
        textoConsulta += `
        <br>👉La temperatura es ${datosAcuario[indice].temp.toFixed(0).toString().replace(".", ",")} (ºC) (${datosAcuario[indice].temp > datosAcuario[indice-2].temp ? "subiendo" : datosAcuario[indice].temp < datosAcuario[indice - 2].temp ? "bajando" : "estable"}); la temperatura óptima o deseable es ${dataConfig.tempOpt.toFixed(0).toString().replace(".", ",")} (ºC).
        `;
        textoConsulta += `<br>👉La inyección de CO2 es: ${getEstado("inyCO2", datosAcuario[indice].inyeccCO2)}`;
        textoConsulta += `<br>👉El CO2 diluido según el pH/KH es: ${datosAcuario[indice].CO2.toFixed(1).toString().replace(".", ",")} (mg/l) (${datosAcuario[indice].CO2 > datosAcuario[indice-2].CO2 ? "subiendo":"bajando"})`;
        textoConsulta += `<br>👉El estado de las plantas es: ${getEstado("plantas", datosAcuario[indice].plantas)}`; 
        textoConsulta += `<br>👉El estado de las algas es: ${getEstado("algas", datosAcuario[indice].algas)}`;
        textoConsulta += `<br>👉El estado del agua es: ${getEstado("agua", datosAcuario[indice].agua)}`;
        textoConsulta += `<br>👉El estado de la superficie del agua es: ${getEstado("supAgua", datosAcuario[indice].sup_agua)}`; 
        
        
        let final = datosAcuario.length - 1;
        let comentarios = [];
        for (let i = final-1; i < final; i++) { 
            comentarios[i] = datosAcuario[i].comentario;
        }

        textoConsulta += `<br><br>Resumen comentarios de la semana:`;
        textoConsulta += `${generarResumenComentarios(comentarios)}`;

        textoConsulta += `<br><br>Analiza los valores y dime si se puede acondicionar o mejorar algo.`;
    } else if (tipo === "todos") {
        // Aquí generas el texto con la tendencia de todos los datos
        modalTitulo.textContent = "Consulta 10 últimas semanas:";
        modalTitulo.classList.add("georgia-bold-italic");
        console.log(datosAcuario[indice].pH,'-',parseFloat(predecirEstado("pH").replace(",", ".")));
        textoConsulta = 'Aquí están las tendencias de los parámetros de mi acuario en las últimas diez semanas. La medición la hice semanalmente cada domingo:';

        textoConsulta += `<br><br>👉Acuario: ${dataConfig.largoAcuario} x ${dataConfig.anchoAcuario} x ${dataConfig.altoAcuario} cms<br>`;
        textoConsulta += `${dataConfig.filtros === "" ? "" : `👉Filtros: ${dataConfig.filtros}`}`;
        textoConsulta += `<br>${dataConfig.calentadores === "" ? "" : `👉Calentadores: ${dataConfig.calentadores}`}`;
        textoConsulta += `<br>${dataConfig.refrigeracion === "" ? "" : `👉Enfriamiento: ${dataConfig.refrigeracion}`}`;
        textoConsulta += `<br>${dataConfig.otros === "" ? "" : `👉Otros elementos: ${dataConfig.otros}`}`;
        // textoConsulta += `<br>👉La tendencia del pH es ${predecirEstado("pH")} (${predecirEstado("pH") > datosAcuario[indice].pH ? "subiendo":"bajando"}); el pH óptimo o deseable es ${dataConfig.pHOpt.toFixed(1).toString().replace(".", ",")}.`;
        textoConsulta += `
        <br>👉La tendencia del pH es ${predecirEstado("pH")} (${parseFloat(predecirEstado("pH").replace(",", ".")) > datosAcuario[indice].pH ? "subiendo" : parseFloat(predecirEstado("pH").replace(",", ".")) < datosAcuario[indice].pH ? "bajando" : "estable"}); el pH óptimo o deseable es ${dataConfig.pHOpt.toFixed(1).toString().replace(".", ",")}.
        `;
        // textoConsulta += `<br>👉La tendencia del KH es ${predecirEstado("KH")} (${predecirEstado("KH") > datosAcuario[indice].KH ? "subiendo":"bajando"}); el KH óptimo o deseable es ${dataConfig.KHOpt.toFixed(1).toString().replace(".", ",")} (dKH).`;
        textoConsulta += `
        <br>👉La tendencia del KH es ${predecirEstado("KH")} (${parseFloat(predecirEstado("KH").replace(",", ".")) > datosAcuario[indice].KH ? "subiendo" : parseFloat(predecirEstado("KH").replace(",", ".")) < datosAcuario[indice].KH ? "bajando" : "estable"}); el KH óptimo o deseable es ${dataConfig.KHOpt.toFixed(1).toString().replace(".", ",")}.
        `;
        // textoConsulta += `<br>👉La tendencia del NO3 es ${predecirEstado("NO3")} (${predecirEstado("NO3") > datosAcuario[indice].NO3 ? "subiendo":"bajando"}).`;
        textoConsulta += `
        <br>👉La tendencia del NO3 es ${predecirEstado("NO3")} (${parseFloat(predecirEstado("NO3").replace(",", ".")) > datosAcuario[indice].NO3 ? "subiendo" : parseFloat(predecirEstado("NO3").replace(",", ".")) < datosAcuario[indice].NO3 ? "bajando" : "estable"}).
        `;
        // textoConsulta += `<br>👉La tendencia de la temperatura es ${predecirEstado("temp")} (${predecirEstado("temp") > datosAcuario[indice].temp ? "subiendo" :
        // "bajando"}); la temperatura óptima o deseable es ${dataConfig.tempOpt.toFixed(0).toString()} (ºC).`;        
        textoConsulta += `<br>👉La tendencia de la temperatura es ${predecirEstado("temp")} (${parseFloat(predecirEstado("temp").replace(",", ".")) > datosAcuario[indice].temp ? "subiendo" : parseFloat(predecirEstado("temp").replace(",", ".")) < datosAcuario[indice].temp ? "bajando" : "estable"}); la temperatura óptima o deseable es ${dataConfig.tempOpt.toFixed(0).toString()} (ºC).`;
        textoConsulta += `<br>👉El método más usado de CO2 en las últimas 10 semanas es: ${predecirEstado("inyCO2")}`;
        // textoConsulta += `<br>👉La tendencia del CO2 diluido según el pH/KH es: ${predecirEstado("CO2")} (${predecirEstado("CO2") > datosAcuario[indice].CO2 ? "subiendo" : "bajando"})`;
        textoConsulta += `
        <br>👉La tendencia del disuelto según el pH/KH es ${predecirEstado("CO2")} (${parseFloat(predecirEstado("CO2").replace(",", ".")) > datosAcuario[indice].CO2 ? "subiendo" : parseFloat(predecirEstado("CO2").replace(",", ".")) < datosAcuario[indice].CO2 ? "bajando" : "estable"}).
        `;
        textoConsulta += `<br>👉La tendencia del estado de las plantas es: ${predecirEstado("plantas")}`; 
        textoConsulta += `<br>👉La tendencia del estado de las algas es: ${predecirEstado("algas")}`;
        textoConsulta += `<br>👉La tendencia del estado del agua es: ${predecirEstado("agua")}`;
        textoConsulta += `<br>👉La tendencia del estado de la superficie del agua es: ${predecirEstado("supAgua")}`;  

        let final = datosAcuario.length - 1;
        let comentarios = [];
        for (let i = final - 10; i < final; i++) { 
            comentarios[i] = datosAcuario[i].comentario;
        }

        textoConsulta += `<br><br>Resumen comentarios de las semanas:`;
        textoConsulta += `${generarResumenComentarios(comentarios)}`;
        textoConsulta += `<br><br>Analiza los valores y dime si se puede acondicionar o mejorar algo.`;    
}
    modalCuerpo.innerHTML = `<p>${textoConsulta}</p>`;

    navigator.clipboard.writeText(textoConsulta.replace(/<br>/g, "\n"));
    modalBootstrap.show();    
}

// Función para copiar al portapapeles y mostrar el modal
function copiarYMostrarConsulta() {
    const texto = generarTextoConsulta();
    if (!texto) return;

    navigator.clipboard.writeText(texto).then(() => {
        modalTitulo.textContent = "Texto copiado al portapapeles";
        modalCuerpo.textContent = texto;
        modalBootstrap.show();
    }).catch(err => {
        mostrarAlerta("Error al copiar al portapapeles.");
        console.error("Error al copiar:", err);
    });
}

function getEstado(tipo, valor) {
    if (tipo === 'plantas') {
        const estadosPlantas = ['Excelente', 'Normal', 'Regular', 'Mal'];
        return estadosPlantas[valor] || '';
    } else if (tipo === 'algas') {
        const estadosAlgas = ['Ninguna', 'Presencia', 'Cubierto', 'Muy cubierto'];
        return estadosAlgas[valor] || '';
    } else if (tipo === 'agua') {
        const estadoAgua = ['Transparente', 'Casi Transparente', 'Turbia', 'Muy Turbia'];
        return estadoAgua[valor] || '';
    } else if (tipo === 'supAgua') {
        const estadoSupAgua = ['Limpia', 'Casi limpia', 'Sucia', 'Muy Sucia'];
        return estadoSupAgua[valor] || '';
    } else if (tipo === 'inyCO2') {
        const estadoInyCO2 = ['Con Levadura', 'Botella a presión', 'Sin CO2'];
        return estadoInyCO2[valor - 1] || '';
    }

    return '';
}

function calcularTendencia(datos, n) {
    let longitud = datos.length;
    if (longitud === 0) return null;

    let inicio = Math.max(0, longitud - n);
    let datosRecientes = datos.slice(inicio);

    let x = Array.from({ length: datosRecientes.length }, (_, i) => i + 1);
    let y = datosRecientes;

    let sumX = x.reduce((acc, val) => acc + val, 0);
    let sumY = y.reduce((acc, val) => acc + val, 0);
    let sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    let sumX2 = x.reduce((acc, val) => acc + val * val, 0);
    let nDatos = y.length;

    let numerador = nDatos * sumXY - sumX * sumY;
    let denominador = nDatos * sumX2 - sumX * sumX;

    return denominador === 0 ? 0 : numerador / denominador;
}


function analizarTendencias(datosAcuario, n) {
    let tendencias = {
        pH: calcularTendencia(datosAcuario.map(d => d.pH), n),
        KH: calcularTendencia(datosAcuario.map(d => d.KH), n),
        NO3: calcularTendencia(datosAcuario.map(d => d.NO3), n),
        temperatura: calcularTendencia(datosAcuario.map(d => d.temp), n),
        CO2: calcularTendencia(datosAcuario.map(d => d.CO2), n),
        plantas: calcularTendencia(datosAcuario.map(d => d.plantas), n),
        algas: calcularTendencia(datosAcuario.map(d => d.algas), n),
        agua: calcularTendencia(datosAcuario.map(d => d.agua), n),
        supAgua: calcularTendencia(datosAcuario.map(d => d.sup_agua), n)
    };

    // Análisis de la inyección de CO2
    if (tendencias.pH > 0 && tendencias.CO2 < 0) {
        tendencias.inyCO2 = "Aumentar";
    } else if (tendencias.pH < 0 && tendencias.CO2 > 0) {
        tendencias.inyCO2 = "Reducir";
    } else {
        tendencias.inyCO2 = "Mantener";
    }

    return tendencias;
}

function predecirEstado(tipo) {
    let valorEsperado;
    const ultimaSemana = datosAcuario[datosAcuario.length - 1];

    let v1;

    switch (tipo) {
        case "plantas":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.plantas),
                10
            );
            valorEsperado = getEstado(tipo, Math.round(ultimaSemana.plantas + v1));
            break;
        case "algas":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.algas),
                10
            );
            valorEsperado = getEstado("algas", Math.round(ultimaSemana.algas + v1));
            break;
        case "agua":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.agua),
                10
            );
            valorEsperado = getEstado("agua", Math.round(ultimaSemana.agua + v1));
            break;
        case "supAgua":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.sup_agua),
                10
            );
            valorEsperado = getEstado(
                "supAgua",
                Math.round(ultimaSemana.sup_agua + v1)
            );
            break;
        case "pH":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.pH),
                10
            );
            valorEsperado = (ultimaSemana.pH + v1)
                .toFixed(1)
                .toString()
                .replace(".", ",");
            break;
        case "KH":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.KH),
                10
            );
            valorEsperado = (ultimaSemana.KH + v1)
                .toFixed(1)
                .toString()
                .replace(".", ",");
            valorEsperado += " (dKH)";
            break;
        case "NO3":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.NO3),
                10
            );
            valorEsperado = (ultimaSemana.NO3 + v1)
                .toFixed(1)
                .toString()
                .replace(".", ",");
            valorEsperado += " (ppm)";
            break;
            case "CO2":
                v1 = calcularTendencia(
                    datosAcuario.map((d) => d.CO2),
                    10
                );
                valorEsperado = (ultimaSemana.CO2 + v1)
                    .toFixed(1)
                    .toString()
                    .replace(".", ",");
                valorEsperado += " (mg/l)";
                break;
        case "temp":
            v1 = calcularTendencia(
                datosAcuario.map((d) => d.temp),
                10
            );
            valorEsperado = (ultimaSemana.temp + v1)
                .toFixed(0)
                .toString()
                .replace(".", ",");
            valorEsperado += " (ºC)";
            break;
        case "inyCO2":
            // Tomar las últimas 'n' semanas
            let n = 10;
            let ultimosCO2 = datosAcuario.slice(-n).map(d => d.inyeccCO2);
            // Calcular la moda
            let co2MasFrecuente = calcularModa(ultimosCO2);
            // Convertir a texto con getEstado()
            valorEsperado = getEstado('inyCO2', co2MasFrecuente);
            break;
    }

    return valorEsperado;
}
function calcularModa(array) {
    let frecuencia = {}; 
    let maxFrecuencia = 0;
    let moda = null;

    for (let valor of array) {
        frecuencia[valor] = (frecuencia[valor] || 0) + 1;
        if (frecuencia[valor] > maxFrecuencia) {
            maxFrecuencia = frecuencia[valor];
            moda = valor;
        }
    }
    return moda;
}

function generarResumenComentarios(comentariosSemanas) {
    const palabrasClave = {
        "algas": "Problema con algas",
        "tratamiento": "Se aplicó tratamiento",
        "pez enfermo": "Se detectó un pez enfermo",
        "poda": "Se realizó poda de plantas",
        "fertilización": "Ajuste en fertilización",
        "agua oxigenada": "Uso de agua oxigenada",
        "cambio de agua": "Cambio de agua realizado",
        "rotíferos": "Cambio en la población de rotíferos",
        "caracoles": "Cambio en la población de caracoles",
        "planarias": "Problemas con planarias",
        "temperatura": "Problema con la temperatura",
        "ciclo de luz": "Cambio en el ciclo de luz",
        "iluminación": "Cambio en la iluminación",
        "luz del acuario": "Causas debidas a la luz del acuario",
        "luz": "Causas debidas a la luz del acuario",
        "Ichthyophthirius": "Infección de Ichthyophthirius",
        "CO2": "Problemas con el CO2"
    };

    let resumenSemanas = [];

    comentariosSemanas.forEach((comentario, index) => {
        let eventos = [];
        for (let clave in palabrasClave) {
            if (comentario.toLowerCase().includes(clave)) {
                eventos.push(palabrasClave[clave]);
            }
        }

        if (eventos.length > 0) {
            resumenSemanas.push(`<br>Semana «${datosAcuario[index+1].Fecha}»: ${eventos.join(", ")}.`);
        }
    });

    return resumenSemanas.length > 0 ? resumenSemanas.join("\n") : "No hay eventos relevantes en las últimas 10 semanas.";
}

// Asignar evento al botón
document.querySelector(".btn-ultimos-datos").addEventListener("click", () => generarTextoConsulta("ultimos"));
document.querySelector(".btn-todos-datos").addEventListener("click", () => generarTextoConsulta("todos"));