// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));
let resultados;

document.addEventListener("DOMContentLoaded", function() {
    // Asignar el nombre del acuario al título
    if (dataConfig && dataConfig.nombreDelAcuario) {
        const tituloAcuario = document.getElementById("tituloAcuario");
        tituloAcuario.textContent = dataConfig.nombreDelAcuario;
    }

    crearGauges();

    buscarComentarios();

    //Inicia icono Inyección de CO2 con 1px tranparente
    document.getElementById('iconoCO2').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
});

let textoBusquedaActual = ""; // Variable global para almacenar el término de búsqueda

function buscarComentarios() {
    const textoBusqueda = document.getElementById("inputBusqueda").value.trim().toLowerCase();
    const incluirPlantas = document.getElementById("checkPlantas").checked;
    const incluirAlgas = document.getElementById("checkAlgas").checked;

    if (!textoBusqueda) {
        // alert("Por favor, escribe algo para buscar.");
        return;
    }

    // Dividimos el texto de búsqueda en palabras (máximo 3 términos)
    const palabrasBusqueda = textoBusqueda.split(" ").filter(palabra => palabra.length > 0).slice(0, 3);
    textoBusquedaActual = palabrasBusqueda; // Guardamos las palabras de búsqueda

    // Filtramos los comentarios que contienen todas las palabras de búsqueda
    resultados = datosAcuario.filter(dato => {
        const comentarioLower = dato.comentario.toLowerCase();
        const coincideTexto = palabrasBusqueda.every(palabra => comentarioLower.includes(palabra));
        const coincidePlantas = !incluirPlantas || dato.plantas > 0;
        const coincideAlgas = !incluirAlgas || dato.algas > 0;
        return coincideTexto && (coincidePlantas || coincideAlgas);
    });

    if (resultados.length === 0) {
        alert("No se encontraron coincidencias.");
    }

    indiceActual = 0;
    actualizarResultado();
    actualizarControles();
}

function actualizarResultado() {
    const fechaResultado = document.getElementById("fecha-resultado");
    const comentarioResultado = document.getElementById("comentarioResultado");

    document.getElementById("fecha-resultado").style.display = "block";

    if (resultados.length > 0) {
        const resultado = resultados[indiceActual];
        fechaResultado.textContent = resultado.Fecha;

        // Resaltamos las palabras de búsqueda en el comentario
        let comentarioConResaltado = resultado.comentario;
        if (textoBusquedaActual && textoBusquedaActual.length > 0) {
            textoBusquedaActual.forEach(palabra => {
                const regex = new RegExp(`(${palabra})`, "gi");
                comentarioConResaltado = comentarioConResaltado.replace(regex, `<span class="highlight">$1</span>`);
            });
        }
        comentarioResultado.innerHTML = comentarioConResaltado;
        comentarioResultado.style.color = "#000";

        // Actualizamos los datos adicionales
        document.getElementById("valorPH").textContent = `${resultado.pH.toFixed(1).toString().replace(".", ",")}`;
        document.getElementById("valorKH").textContent = `${resultado.KH.toFixed(1).toString().replace(".", ",")}`;
        document.getElementById("valorTemp").textContent = `${resultado.temp}(ºC)`;
        document.getElementById("valorNO3").textContent = `${resultado.NO3}(ppm)`;
        document.getElementById("valorCO2").textContent = `${resultado.CO2.toFixed(2).toString().replace(".", ",")}(mg/l)`;

        //Resultado inyección CO2
        switch (resultado.inyeccCO2) {
            case 1:
                document.getElementById('iconoCO2').src = './imagenes/CO2 con Levadura.png';
                break;
            case 2:
                document.getElementById('iconoCO2').src = './imagenes/CO2 con Botella Presión.png';
                break;
            case 3:
                document.getElementById('iconoCO2').src = './imagenes/Sin CO2.png';
                break;
        }

        options.container = document.getElementById("gaugePlantas");
        options.value = resultado.plantas + 1;
        chartPlantas.update(options);
        options.container = document.getElementById("gaugeAlgas");
        options.value = resultado.algas + 1;
        chartAlgas.update(options);
        options.container = document.getElementById("gaugeAgua");
        options.value = resultado.agua + 1;
        chartAgua.update(options);
        options.container = document.getElementById("gaugeSupAgua");
        options.value = resultado.sup_agua + 1;
        chartSupAgua.update(options);
    } else {
        fechaResultado.textContent = "\u00A0"; // Espacio en blanco (no visible)
        comentarioResultado.innerHTML = "No hay resultados, realizar una búsqueda.";
        comentarioResultado.style.color = "gray";

        // Limpiamos los datos
        document.getElementById("valorPH").textContent = "";
        document.getElementById("valorKH").textContent = "";
        document.getElementById("valorTemp").textContent = "";
        document.getElementById("valorNO3").textContent = "";
        document.getElementById("valorCO2").textContent = "";

        //Inicia icono Inyección de CO2 con 1px tranparente
        document.getElementById('iconoCO2').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        options.container = document.getElementById("gaugePlantas");
        options.value = 0;
        chartPlantas.update(options);
        options.container = document.getElementById("gaugeAlgas");
        options.value = 0;
        chartAlgas.update(options);
        options.container = document.getElementById("gaugeAgua");
        options.value = 0;
        chartAgua.update(options);
        options.container = document.getElementById("gaugeSupAgua");
        options.value = 0;
        chartSupAgua.update(options);
    }
}

// Actualizar controles de navegación
function actualizarControles() {
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const contadorResultados = document.getElementById("contadorResultados");

    if (resultados.length > 0) {
        btnAnterior.disabled = false;
        btnSiguiente.disabled = false; // Siempre habilitados con ciclo
        contadorResultados.textContent = `${indiceActual + 1} / ${resultados.length}`;
    } else {
        btnAnterior.disabled = true;
        btnSiguiente.disabled = true;
        contadorResultados.textContent = "0 / 0";
    }
}

document.getElementById("btnBuscar").addEventListener("click", function() {
    const textoBusqueda = document.getElementById("inputBusqueda").value.trim();

    if (textoBusqueda === "") {
        // Si el texto de búsqueda está vacío, limpiamos los resultados
        document.getElementById("comentarioResultado").textContent = "No hay resultados, realizar una búsqueda.";
        document.getElementById("fecha-resultado").textContent = "\u00A0"; // Espacio en blanco
        document.getElementById("control-resultados").style.display = "none";
        document.getElementById("resultados-extra").style.display = "none";
        document.getElementById("contadorResultados").textContent = "0 / 0";
        document.getElementById("btnAnterior").disabled = true;
        document.getElementById("btnSiguiente").disabled = true;

        // Limpiar los valores de pH, KH, Temp, NO3 y CO2
        document.getElementById("valorPH").textContent = "";
        document.getElementById("valorKH").textContent = "";
        document.getElementById("valorTemp").textContent = "";
        document.getElementById("valorNO3").textContent = "";
        document.getElementById("valorCO2").textContent = "";

        //Inicia icono Inyección de CO2 con 1px tranparente
        document.getElementById('iconoCO2').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        //Restaura los gauges
        options.container = document.getElementById("gaugePlantas");
        options.value = 0;
        chartPlantas.update(options);
        options.container = document.getElementById("gaugeAlgas");
        options.value = 0;
        chartAlgas.update(options);
        options.container = document.getElementById("gaugeAgua");
        options.value = 0;
        chartAgua.update(options);
        options.container = document.getElementById("gaugeSupAgua");
        options.value = 0;
        chartSupAgua.update(options);

        return; // Salimos de la función si el texto de búsqueda está vacío
    }

    // Aquí va el código de la búsqueda cuando el texto no está vacío
    buscarComentarios(textoBusqueda);
});

document.getElementById("clearBusqueda").addEventListener("click", function() {
    // Borrar el texto de búsqueda
    document.getElementById("inputBusqueda").value = "";

    // Llamar al evento del botón de búsqueda para borrar los resultados
    document.getElementById("btnBuscar").click();
});

// Navegación entre resultados
document.getElementById("btnAnterior").addEventListener("click", () => {
    if (resultados.length > 0) {
        if (indiceActual > 0) {
            indiceActual--;
        } else {
            indiceActual = resultados.length - 1; // Ciclar al final
        }
        actualizarResultado();
        actualizarControles(); // Asegura que los botones estén habilitados después del ciclo
    }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {

    // if (indiceActual < resultados.length - 1) {
    //     indiceActual++;
    if (resultados.length > 0) {
        indiceActual = (indiceActual < resultados.length - 1) ? indiceActual + 1 : 0;
        actualizarResultado();
        actualizarControles();
    }
    // }
});

// Evento para buscar
document.getElementById("btnBuscar").addEventListener("click", buscarComentarios);

const { AgCharts } = agCharts;

let options = {
    type: 'linear-gauge',
    direction: 'horizontal',
    container: "",
    value: 2,
    scale: {
        min: 0,
        max: 4,
        label: {
            enabled: false,
        },
        tick: {
            width: 0, // Elimina los ticks
        },
    },
    thickness: 15,
    background: {
        fill: 'transparent',
        strokeWidth: 0, // Sin bordes en el fondo
    },
    bar: {
        fills: [{ color: 'green' }, { color: '#FCC737' }, { color: '#F26B0F' }, { color: 'red' }],
        fillMode: 'continous',
    },
};

let chartPlantas, chartAlgas, chartAgua, chartSupAgua;

function crearGauges() {
    //Crea los gauges
    options.container = document.getElementById("gaugePlantas");
    options.value = 0;
    chartPlantas = AgCharts.createGauge(options);
    options.container = document.getElementById("gaugeAlgas");
    options.value = 0;
    chartAlgas = AgCharts.createGauge(options);
    options.container = document.getElementById("gaugeAgua");
    options.value = 0;
    chartAgua = AgCharts.createGauge(options);
    options.container = document.getElementById("gaugeSupAgua");
    options.value = 0;
    chartSupAgua = AgCharts.createGauge(options);
}