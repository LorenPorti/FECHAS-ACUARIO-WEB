let chart = null; // Declaración globalupdate

const datosAcuario = JSON.parse(localStorage.getItem('datosAcuario'));

const rangoNavigator = {
    min: (datosAcuario.length - 95) / datosAcuario.length, //(104 dos años, presenta 95) 95 es para que se vean más fechas en el eje x
    max: 1, // Mostrar un año al inicio
};

const fechas = obtenerFechasDeDatosAcuario();
const valoresPH = datosAcuario.map(dato => dato.pH);
const valoresKH = datosAcuario.map(dato => dato.KH);
const valoresNO3 = datosAcuario.map(dato => dato.NO3);
const valoresCO2 = datosAcuario.map(dato => dato.CO2);
const valorestemp = datosAcuario.map(dato => dato.temp);
const valorestendenciaGral = datosAcuario.map(dato => dato.resultado);
// Cálculo de la regresión polinómica de grado 3.
const xValores = fechas.map((_, index) => index); // Índices como eje X
const coeficientesTendenciaCO2 = calcularRegresionPolinomica(xValores, valoresCO2, 2);
const coeficientesTendenciaGral = calcularRegresionPolinomica(xValores, valorestendenciaGral, 2);
const coeficientesTendenciaNO3 = calcularRegresionPolinomica(xValores, valoresNO3, 2);

// Generar los valores ajustados de tendencia usando el polinomio
const valoresAjustadosCO2 = xValores.map(x => evaluarPolinomio(coeficientesTendenciaCO2, x));
const valoresAjustadosTendenciaGral = xValores.map(x => evaluarPolinomio(coeficientesTendenciaGral, x));
const valoresAjustadosNO3 = xValores.map(x => evaluarPolinomio(coeficientesTendenciaNO3, x));

let dataSeleccion = fechas.slice(0, datosAcuario.length).map((fecha, i) => ({
    fecha,
    pH: valoresPH[i],
    KH: valoresKH[i],
    NO3: valoresNO3[i],
    CO2: valoresCO2[i],
    temp: valorestemp[i],
    tendenciaGral: valoresAjustadosTendenciaGral[i],
    tendenciaCO2: valoresAjustadosCO2[i], // Nueva serie ajustada
    tendenciaNO3: valoresAjustadosNO3[i],
}));

let options = {
    container: document.getElementById("graficoLineas"),
    // autoSize: true, // Ajuste automático del tamaño
    // title: {
    //     text: 'Datos del Acuario',
    //     fontSize: 18,
    // },
    data: dataSeleccion,
    series: [{
            type: "line",
            xKey: "fecha",
            yKey: "pH",
            yName: "pH",
            stroke: "blue",
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "blue", // Color del botón en la leyenda para esta serie
                size: 0, //Elimina los marcadores de los nodos
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${params.datum.fecha}<br>pH: ${params.datum.pH} eje Izda`,
                    backgroundColor: "blue", // Color de fondo igual al de la serie
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "KH",
            yName: "KH",
            stroke: "green",
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "green", // Color del botón en la leyenda para esta serie
                size: 0, //Elimina los marcadores de los nodos
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${params.datum.fecha}<br>KH: ${params.datum.KH} (dKH) eje Izda`,
                    backgroundColor: "green", // Color de fondo igual al de la serie
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "CO2",
            yName: "CO2",
            stroke: "DeepSkyBlue",
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "DeepSkyBlue", // Color del botón en la leyenda para esta serie
                size: 0, //Elimina los marcadores de los nodos
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${
            params.datum.fecha
          }<br>CO2: ${params.datum.CO2.toFixed(2).replace(
            ".",
            ","
          )} (mg/l) eje Dcha`,
                    backgroundColor: "DeepSkyBlue", // Color de fondo igual al de la serie
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "NO3",
            yName: "NO3",
            stroke: "#C96868",
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "#C96868", // Color del botón en la leyenda para esta serie
                size: 0, //Elimina los marcadores de los nodos
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${
            params.datum.fecha
          }<br>NO3: ${params.datum.NO3.toFixed(2).replace(
            ".",
            ","
          )} (ppm) eje Dcha`,
                    backgroundColor: "#C96868", // Color de fondo igual al de la serie
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "temp",
            yName: "temp",
            stroke: "#DEAA79",
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "#DEAA79", // Color del botón en la leyenda para esta serie
                size: 0, //Elimina los marcadores de los nodos
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${params.datum.fecha}<br>temp: ${params.datum.temp} ºC eje Dcha`,
                    backgroundColor: "#DEAA79", // Color de fondo igual al de la serie
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "tendenciaGral",
            yName: "Tendencia Gral",
            stroke: "Purple",
            strokeWidth: 4,
            interpolation: {
                type: "smooth"
            },
            marker: {
                fill: "Purple", // Color del botón en la leyenda para esta serie
                size: 0, //Elimina los marcadores de los nodos
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${
            params.datum.fecha
          }<br>Tendencia Gral: ${params.datum.tendenciaGral
            .toFixed(2)
            .replace(".", ",")} eje Izda`,
                    backgroundColor: "Purple", // Color de fondo igual al de la serie
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "tendenciaCO2",
            yName: "Tendencia CO2",
            stroke: "#2e86c1",
            strokeWidth: 3,
            lineDash: [10, 5],
            visible: false,
            // showInLegend: false, // Oculta esta serie en la leyenda
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "#2e86c1",
                size: 0,
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${
            params.datum.fecha
          }<br>Tendencia CO2: ${params.datum.tendenciaCO2
            .toFixed(2)
            .replace(".", ",")} eje Dcha`,
                    backgroundColor: "#2e86c1",
                }),
            },
        },
        {
            type: "line",
            xKey: "fecha",
            yKey: "tendenciaNO3",
            yName: "Tendencia NO3",
            stroke: "#943126",
            strokeWidth: 3,
            lineDash: [10, 5],
            visible: false,
            interpolation: {
                type: "smooth",
            },
            marker: {
                fill: "#943126",
                size: 0,
            },
            tooltip: {
                renderer: (params) => ({
                    content: `Fecha: ${
            params.datum.fecha
          }<br>Tendencia NO3: ${params.datum.tendenciaNO3.toFixed(
            0
          )} eje Dcha`,
                    backgroundColor: "#943126",
                }),
            },
        },
    ],
    axes: [{
            type: "category",
            position: "bottom",
            title: { text: "Fechas" },
            key: "Fecha",
            interval: {
                maxSpacing: 52,
            },
            label: {
                rotation: 270,
                fontSize: 10, // Reducir el tamaño de la fuente en pantallas pequeñas
                formatter: (params) => {
                    const index = datosAcuario.findIndex(
                        (dato) => dato.Fecha === params.value
                    );

                    // Mostrar solo la fecha en el primer valor de cada año (cada 52 elementos) o cada x intervalos
                    return index % 52 === 0 || index % 4 === 0 ? params.value : "";
                },
            },
            // tick: {
            //     maxSpacing: 60, // Ajusta el espacio máximo entre las etiquetas
            // },
        },
        {
            type: "number",
            position: "left",
            // title: { text: 'pH - KH (dKH)' },
            keys: ["pH", "KH", "tendenciaGral"], // Asociar ejes a estas series
            gridLine: {
                enabled: true,
                style: [{
                        stroke: "gray",
                        lineDash: [10, 5],
                    },
                    {
                        stroke: "lightgray",
                        lineDash: [5, 5],
                    },
                ],
            },
            min: 0,
            max: 10,
            interval: { step: 0.5 },
        },
        {
            type: "number",
            position: "right",
            // title: { text: 'NO3 (ppm)' },
            keys: ["NO3", "CO2", "temp", "tendenciaCO2", "tendenciaNO3"], // Asociar eje a esta serie
            // gridLine: {
            //     enabled: true,
            //     style: [
            //         { stroke: 'red', lineDash: [4, 4], }, // Línea punteada roja
            //     ],
            // },
            interval: { step: 20 },
            min: 0,
            max: 50,
        },
    ],
    navigator: {
        enabled: true,
        height: 40, // Altura del navigator
        minHandle: {
            fill: "darkgrey",
            stroke: "black",
            width: 16,
            height: 30,
            gripLineGap: 4,
            gripLineLength: 12,
            strokeWidth: 2,
        },
        maxHandle: {
            fill: "darkgrey",
            stroke: "black",
            width: 16,
            height: 30,
            gripLineGap: 4,
            gripLineLength: 12,
            strokeWidth: 2,
        },
        // min: rangoNavigator.min,
        // max: rangoNavigator.max,
        // handles: {
        //     visible: true, // Deshabilitar los controles laterales
        // },
        mask: {
            fill: "#705C53", // Color de la selección
        },
        // min: rangoNavigator.min,
        // max: rangoNavigator.max,
        min: 0,
        max: 0.7 //Con estos valores del Navigator sale seleccionado todo (Gráfico completo). Para una zona determinada arrastar los cursores del navegador gráfico
    },
    legend: {
        position: "bottom",
        item: {
            marker: {
                size: 16, // Aumenta el tamaño del marcador
            },
            label: {
                fontSize: 14, // Ajusta el tamaño del texto
            },
            paddingX: 10, // Espaciado horizontal entre marcador y texto
            paddingY: 5, // Espaciado vertical entre filas de la leyenda
        },
    },
};

function inicializarGraficoAG() {

    if (!datosAcuario || datosAcuario.length === 0) {
        console.error("No se encontraron datos en 'datosAcuario'");
        return;
    }

    chart = agCharts.AgCharts.create(options);
}

document.addEventListener('DOMContentLoaded', () => {
    // inicializarGrafico();
    inicializarGraficoAG();

    actualizarNavigator(rangoNavigator.min, rangoNavigator.max);

    //********** OCULTAR TODAS LAS SERIES ******************
    const botonOcultarSeries = document.getElementById('ocultar-series');

    botonOcultarSeries.addEventListener('click', event => {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace

        if (chart && chart.chart && chart.chart.series) {
            const series = chart.chart.series;

            // Actualizar la visibilidad de las series
            series.forEach(serie => {
                //     serie.visible = serie.properties.yKey === 'tendenciaGral';
                // Buscar un identificador confiable en cada serie

                if (serie.properties.yKey) {
                    serie.visible = serie.properties.yKey === 'tendenciaGral';
                } else {
                    console.warn('Serie sin yKey válida:', serie);
                    serie.visible = false; // Ocultar series no identificadas
                }
            });

            // Forzar redibujado del gráfico
            chart.chart.update(); // Método directo para refrescar el gráfico
        } else {
            console.error('No se pudo acceder a las series del gráfico.');
        }
    });

    //********** MOSTRA TODAS LAS SERIE ******************
    const botonMostrarSeries = document.getElementById('mostrar-series');

    botonMostrarSeries.addEventListener('click', event => {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace

        if (chart && chart.chart && chart.chart.series) {
            const series = chart.chart.series;

            // Hacer visibles todas las series
            series.forEach(serie => {
                serie.visible = true;
            });

            // Forzar redibujado del gráfico
            chart.chart.update(); // Método directo para refrescar el gráfico
        } else {
            console.error('No se pudo acceder a las series del gráfico.');
        }
    });

    //********** IR A UNA FECHA ******************
    document.getElementById('irAFecha').addEventListener('click', (event) => {
        event.preventDefault();

        reiniciarInputDate();

        const dateInputContainer = document.getElementById('dateInputContainer');
        const dateInput = document.getElementById('dateInput');

        // Posicionar el selector de fecha justo debajo de "Ir a Fecha"
        const rect = event.target.getBoundingClientRect();
        dateInputContainer.style.left = `${rect.left}px`;
        dateInputContainer.style.top = `${rect.bottom + window.scrollY}px`;
        dateInputContainer.style.display = "block"; // Mostrar el selector de fecha

        // Manejar selección de fecha
        dateInput.addEventListener('change', function onDateChange(event) {
            const selectedDate = new Date(event.target.value);
            const firstDate1 = parseToDate(datosAcuario[0].Fecha);
            const lastDate1 = parseToDate(datosAcuario[datosAcuario.length - 1].Fecha);
            const firstDate = parseToDate(datosAcuario[0].Fecha);
            const lastDate = parseToDate(datosAcuario[datosAcuario.length - 1].Fecha);
            lastDate.setDate(lastDate.getDate() + 1);
            firstDate.setDate(firstDate.getDate() - 1);
            let selectedDateString = dateToFormattedString(selectedDate);


            setTimeout(() => {
                dateInput.valueAsDate = selectedDate; //Muestra la fecha en el selector
            }, 100);

            // Validar que la fecha seleccionada sea un domingo
            if (selectedDate.getDay() !== 0) {
                mostrarMensajeEmergente("La fecha seleccionada debe ser un domingo.");
                return;
            }

            // Validar que la fecha esté dentro del rango
            if (selectedDate < firstDate || selectedDate > lastDate) {
                mostrarMensajeEmergente(`La fecha debe estar entre ${firstDate1.toLocaleDateString()} y ${lastDate1.toLocaleDateString()}.`);
                return;
            }

            selectedDateString = dateToFormattedString(selectedDate).replace(/\bsept\b/, "sep");

            // Calcular los valores del navigator
            const index = datosAcuario.findIndex(d => d.Fecha.replace(".", "") === selectedDateString);

            if (index !== -1) {
                const totalDatos = datosAcuario.length;
                // rangoNavigator = {
                //     // min: Math.max(0, index - 95) / totalDatos, // Dos año antes 104 (95 para que se vean más fechas en el eje x)
                //     // max: Math.min(1, (index + 1) / totalDatos) // Incluir el dato seleccionado
                //     min: index / totalDatos,
                //     max: (index + 95) / totalDatos,
                // };

                actualizarNavigator(index / totalDatos, (index + 95) / totalDatos);
            } else {
                console.error("No se pudo encontrar el índice correspondiente a la fecha seleccionada.");
            }

            // Limpiar y quitar el evento para evitar múltiples llamadas
            dateInput.value = "";
            dateInput.removeEventListener("change", onDateChange);

            reiniciarInputDate();
        });

        // Manejar clic fuera del selector para ocultarlo
        function ocultarSelectorFecha(evento) {
            if (!dateInputContainer.contains(evento.target) && evento.target !== dateInput) {
                document.removeEventListener("click", ocultarSelectorFecha);
                dateInputContainer.style.display = "none";
            }
        }

        // Asegurarse de que el evento de clic se registre después de mostrar el selector
        setTimeout(() => {
            document.addEventListener("click", ocultarSelectorFecha);
        }, 0);
    });

    //Convierte date a la forma "10 nov. 2024"
    function dateToFormattedString(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        let formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);

        // Eliminar el cero inicial del día si existe
        formattedDate = formattedDate.replace(/^0(\d)/, "$1");

        return formattedDate;

    }

    function mostrarMensajeEmergente(mensaje) {
        const mensajeContenedor = document.getElementById("mensajeEmergente");
        // const oldDateInput = document.getElementById("dateInput");
        mensajeContenedor.textContent = mensaje;
        mensajeContenedor.style.display = "block";

        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
            reiniciarInputDate();
        }, 4000);
    }

    function obtenerFechaSeleccionada() {
        const inputFecha = document.getElementById('fechaInput'); // ID del input
        return inputFecha ? inputFecha.value : null;
    }

    //********** INFORMACIÓN DE UNA FECHA ******************
    document.getElementById('infoFecha').addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace

        const dateInputContainer = document.getElementById('dateInputContainer');
        const dateInput = document.getElementById('dateInput');

        // Posicionar el selector de fecha justo debajo de "Ir a Fecha"
        const rect = event.target.getBoundingClientRect();
        dateInputContainer.style.left = `${rect.left}px`;
        dateInputContainer.style.top = `${rect.bottom + window.scrollY}px`;
        dateInputContainer.style.display = "block"; // Mostrar el selector de fecha

        // Manejar selección de fecha
        dateInput.addEventListener('change', function onDateChange(event) {
            const selectedDate = new Date(event.target.value);
            const firstDate1 = parseToDate(datosAcuario[0].Fecha);
            const lastDate1 = parseToDate(datosAcuario[datosAcuario.length - 1].Fecha);
            const firstDate = parseToDate(datosAcuario[0].Fecha);
            const lastDate = parseToDate(datosAcuario[datosAcuario.length - 1].Fecha);
            lastDate.setDate(lastDate.getDate() + 1);
            firstDate.setDate(firstDate.getDate() - 1);

            const selectedDateString = dateToFormattedString(selectedDate).replace(/\bsept\b/, "sep");

            setTimeout(() => {
                dateInput.valueAsDate = selectedDate; //Muestra la fecha en el selector
            }, 100);

            // Validar que la fecha seleccionada sea un domingo
            if (selectedDate.getDay() !== 0) {
                mostrarMensajeEmergente("La fecha seleccionada debe ser un domingo.");
                return;
            }

            // Validar que la fecha esté dentro del rango
            if (selectedDate < firstDate || selectedDate > lastDate) {
                mostrarMensajeEmergente(`La fecha debe estar entre ${firstDate1.toLocaleDateString()} y ${lastDate1.toLocaleDateString()}.`);
                return;
            }

            const index = datosAcuario.findIndex(d => d.Fecha.replace(".", "") === selectedDateString);

            actualizarModal(datosAcuario[index].Fecha);

        });


        // Datos de ejemplo (puedes reemplazarlos con datos dinámicos)


        // Llenar y mostrar el modal

    });
});

function actualizarModal(fecha) {
    const modal = document.getElementById("modalEstadisticas");

    const indice = datosAcuario.findIndex(dato => dato.Fecha === fecha);
    const valDatos = datosAcuario[indice];
    let dato1, dato2;

    let diferenciaEstado = "";
    let signo = "";
    if (indice == 0) {
        dato2 = 0;
        dato1 = 0;
        diferenciaEstado = "ESTABLE ";
        signo = "±";
    } else {
        dato1 = dataSeleccion[indice - 2].tendenciaGral.toFixed(3);
        dato2 = dataSeleccion[indice - 1].tendenciaGral.toFixed(3);
        if (dato2 - dato1 > 0) {
            diferenciaEstado = "DESFAVORABLE ";
            signo = "+";
        } else if (dato2 - dato1 < 0) {
            diferenciaEstado = "FAVORABLE ";
            signo = "";
        } else if (dato2 == dato1) {
            diferenciaEstado = "ESTABLE ";
            signo = "±";
        }
    }

    document.getElementById("modal-title").textContent = valDatos.Fecha;

    document.getElementById("modal-datos").innerHTML = `» La diferencia de la curva de tendencia Gral con valores anteriores en este punto es <b style="color: Maroon; font-style: italic; ">${diferenciaEstado}</b>(${signo}${(dato2-dato1).toFixed(3).replace(".",",")}).`;
    document.getElementById("modalPH").innerHTML = `<b style="color: Maroon;">pH:</b> ${valDatos.pH.toFixed(1).toString().replace(".", ",")}`;
    document.getElementById("modalKH").innerHTML = `<b style="color: Maroon;">KH:</b> ${valDatos.KH.toFixed(1).toString().replace(".", ",")} dKH`;
    document.getElementById("modalTemp").innerHTML = `<b style="color: Maroon; ">Temperatura:</b> ${valDatos.temp} ºC`;
    document.getElementById("modalCO2").innerHTML = `<b style="color: Maroon; ">CO2:</b> ${valDatos.CO2.toFixed(2).toString().replace(".", ",")} mg/l`;
    document.getElementById("modalNO3").innerHTML = `<b style="color: Maroon; ">NO3:</b> ${valDatos.NO3} ppm`;
    document.getElementById("modalPlantas").innerHTML = `<b style="color: Maroon; ">Plantas:</b> ${getEstado("plantas", valDatos.plantas)}`;
    document.getElementById("modalAgua").innerHTML = `<b style="color: Maroon; ">Agua:</b> ${getEstado("agua", valDatos.agua)}`;
    document.getElementById("modalAlgas").innerHTML = `<b style="color: Maroon; ">Algas:</b> ${getEstado("algas", valDatos.algas)}`;
    document.getElementById("modalSupAgua").innerHTML = `<b style="color: Maroon; ">Superf. agua:</b> ${getEstado("supAgua", valDatos.sup_agua)}`;
    document.getElementById("modalInyCO2").innerHTML = `<b style="color: Maroon; ">Inyección de CO2:</b> ${getEstado("inyCO2", valDatos.inyeccCO2)}`;
    document.getElementById("modalTendGral").innerHTML = `<b style="color: Maroon; ">Regresión Lineal Gral:</b> ${valDatos.tendencia.toFixed(3).toString().replace(".", ",")} - (Óptimo = 0,000)`;
    document.getElementById("modalTendNO3").innerHTML = `<b style="color: Maroon; ">Regresión Lineal NO3:</b> ${calcularTendencia(datosAcuario,1,indice).replace(".", ",")} - (Ópt. = 5-10 ppm)`;
    document.getElementById("modalTendCO2").innerHTML = `<b style="color: Maroon; ">Regresión Lineal CO2:</b> ${calcularTendencia(datosAcuario, 2, indice).replace(".", ",")} - (Ópt. = 6-15 mg/l)`;
    console.log(calcularTendencia(datosAcuario, 2, indice));
    document.getElementById("modal-comments").textContent = `${valDatos.comentario}`;

    modal.style.display = "block";
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modalEstadisticas");
    if (event.target === modal) {
        cerrarModal();
    }
});

// Función para obtener el estado de las plantas, algas, agua o superifice agua e Inyección de CO2
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


function calcularTendencia(datosAcuario, tipoTendencia, indice) {
    // Garantizar que el índice esté dentro de los límites
    indice = Math.max(0, Math.min(indice, datosAcuario.length - 1));

    // Prepara los valores X e Y según el tipo de tendencia
    const valX = [];
    const valY = [];

    datosAcuario.forEach((dato, i) => {
        valX.push(i); // X: Índices de tiempo
        switch (tipoTendencia) {
            case 0:
                valY.push(dato.resultado); // Tendencia general
                break;
            case 1:
                valY.push(dato.NO3); // Tendencia nitratos
                break;
            case 2:
                valY.push(dato.CO2); // Tendencia CO2
                break;
            default:
                throw new Error("Tipo de tendencia no válido");
        }
    });

    // Calcular la pendiente (a) y la intersección (b) de la recta (regresión lineal)
    const n = valX.length;
    const sumX = valX.reduce((sum, x) => sum + x, 0);
    const sumY = valY.reduce((sum, y) => sum + y, 0);
    const sumXY = valX.reduce((sum, x, i) => sum + x * valY[i], 0);
    const sumX2 = valX.reduce((sum, x) => sum + x * x, 0);

    // Fórmulas de regresión lineal
    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - a * sumX) / n;

    // Calcular el valor de la tendencia en el índice solicitado
    const y = a * indice + b;

    return y.toFixed(2); // Redondeamos el resultado a 3 decimales
}

function reiniciarInputDate() {
    const mensajeContenedor = document.getElementById("mensajeEmergente");
    const oldDateInput = document.getElementById("dateInput");

    // Reiniciar el campo de fecha
    if (oldDateInput) {
        const newDateInput = oldDateInput.cloneNode(true); // Clonar el input original
        oldDateInput.parentNode.replaceChild(newDateInput, oldDateInput); // Reemplazar el viejo con el nuevo
        newDateInput.value = ""; // Asegurar que esté vacío        
    }

    mensajeContenedor.style.display = "none";

    // Asegurarse de que el contenedor del selector de fecha esté oculto
    if (dateInputContainer) {
        dateInputContainer.style.display = "none";
    }
}

function actualizarNavigator(minimo, maximo) {
    const totalDatos = datosAcuario.length;

    // Ocultar los manejadores si no hay suficientes datos
    if (totalDatos <= 95) {
        chart.chart.navigator.minHandle.visible = false;
        chart.chart.navigator.maxHandle.visible = false;
        return;
    }

    // Asegurar que mínimo y máximo estén dentro de los límites
    if (minimo < 0) minimo = 0;
    if (maximo > 1) maximo = 1;

    // Calcular rango mínimo permitido y verificar límites
    const rangoMinimo = 1 / totalDatos; // Al menos 1 dato visible
    const minFinal = Math.max(0, (totalDatos - 95) / totalDatos);

    // Ajustar el rango
    let nuevoMin = minimo;
    let nuevoMax = minimo + (95 / totalDatos);

    if (nuevoMin > minFinal) {
        nuevoMin = rangoNavigator.min;
        nuevoMax = 1;
        chart.chart.navigator.max = nuevoMax; //Max antes que el mínimo sino agCharts ignora el máximo
        chart.chart.navigator.min = nuevoMin;
    } else {
        // Configurar los valores del navigator
        chart.chart.navigator.min = nuevoMin; //Min antes que el Máximo sino agCharts ignora el mínimo
        chart.chart.navigator.max = nuevoMax;
    }

    chart.chart.update(options);
}

/**
 * Calcula la regresión polinómica de un conjunto de datos.
 * @param {Array<number>} x - Valores del eje X.
 * @param {Array<number>} y - Valores del eje Y.
 * @param {number} grado - Grado del polinomio.
 * @returns {Array<number>} Coeficientes del polinomio (de mayor a menor grado).
 */
function calcularRegresionPolinomica(x, y, grado) {
    if (x.length !== y.length) {
        console.error("Los datos de x e y deben tener el mismo tamaño.");
        return [];
    }
    const X = x.map(xi => Array.from({ length: grado + 1 }, (_, k) => Math.pow(xi, k)).reverse());
    const XT = math.transpose(X);
    const XTX = math.multiply(XT, X);
    const XTY = math.multiply(XT, y);
    const coeficientes = math.lusolve(XTX, XTY).flat(); // Resolver el sistema
    return coeficientes.reverse(); // Devuelve de mayor a menor grado
}

/**
 * Evalúa un polinomio en un punto dado.
 * @param {Array<number>} coeficientes - Coeficientes del polinomio.
 * @param {number} x - Valor en el que se evalúa.
 * @returns {number} Valor del polinomio.
 */
function evaluarPolinomio(coeficientes, x) {
    return coeficientes.reduce((sum, coef, index) => sum + coef * Math.pow(x, index), 0);
}

function obtenerFechasDeDatosAcuario() {
    // Obtén los datos del localStorage
    // const datosAcuario = JSON.parse(localStorage.getItem('datosAcuario'));

    const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
    const nombreDelAcuario = dataConfig.nombreDelAcuario;

    // Mostrar nombre del acuario en la cabecera
    const cabeceraTitulo = document.getElementById("tituloAcuario");
    cabeceraTitulo.textContent = nombreDelAcuario;

    if (!datosAcuario || datosAcuario.length === 0) {
        console.error("No se encontraron datos en 'datosAcuario'");
        return [];
    }

    // Extrae las fechas directamente del objeto
    return datosAcuario.map(dato => dato.Fecha); // Usa "Fecha" tal cual está en el objeto
}

function formatearFecha(fechaTexto) {
    const fecha = new Date(fechaTexto);
    return fecha.toISOString().split('T')[0]; // Devuelve 'YYYY-MM-DD'
}

function generarLeyendaVertical(eje, valores) {
    const contenedorEje = document.querySelector(`.eje-vertical.${eje}`);
    contenedorEje.innerHTML = ""; // Limpia contenido previo

    valores.forEach(valor => {
        const item = document.createElement("div");
        item.textContent = valor;
        item.style.flex = "1"; // Distribuir espacio uniformemente
        contenedorEje.appendChild(item);
    });
}

function parseToDate(dateString) {
    const months = {
        "ene": 0,
        "feb": 1,
        "mar": 2,
        "abr": 3,
        "may": 4,
        "jun": 5,
        "jul": 6,
        "ago": 7,
        "sep": 8,
        "oct": 9,
        "nov": 10,
        "dic": 11
    };

    // Limpiar el mes (quitar el punto)
    const cleanedDateString = dateString.replace(".", "").toLowerCase();

    // Separar la fecha en día, mes y año
    const [day, month, year] = cleanedDateString.split(" ");

    // Crear el objeto Date usando el formato "year, monthIndex, day"
    const date = new Date(year, months[month], day);

    return date;
}

// Función para llenar el modal con los datos
function abrirModalEstadisticas(datos) {

    // Rellenar los elementos del modal con los datos
    document.getElementById("modal-title").innerText = datos.fecha;
    document.getElementById("modal-datos").innerHTML = `» La diferencia de la curva de tendencia Gral con valores anteriores es <b style="color: Maroon; font-style: italic;">${datos.diferencia}</b>`;
    document.getElementById("modalPH").innerText = datos.ph;
    document.getElementById("modalKH").innerHTML = `<b style="color: Maroon;">KH:</b> ${datos.kh}`;
    document.getElementById("modalTemp").innerHTML = `<b style="color: Maroon;">Temperatura:</b> ${datos.temperatura}`;
    document.getElementById("modalCO2").innerHTML = `<b style="color: Maroon;">CO2:</b> ${datos.co2}`;
    document.getElementById("modalNO3").innerHTML = `<b style="color: Maroon;">NO3:</b> ${datos.no3}`;
    document.getElementById("modalPlantas").innerHTML = `<b style="color: Maroon;">Plantas:</b> ${datos.plantas}`;
    document.getElementById("modalAgua").innerHTML = `<b style="color: Maroon;">Agua:</b> ${datos.agua}`;
    document.getElementById("modalAlgas").innerHTML = `<b style="color: Maroon;">Algas:</b> ${datos.algas}`;
    document.getElementById("modalSupAgua").innerHTML = `<b style="color: Maroon;">Superficie agua:</b> ${datos.supAgua}`;
    document.getElementById("modalInyCO2").innerHTML = `<b style="color: Maroon;">Inyección de CO2:</b> ${datos.inyCO2}`;
    document.getElementById("modalTendGral").innerHTML = `<b style="color: Maroon;">Tendencia Gral:</b> ${datos.tendGral}`;
    document.getElementById("modalTendNO3").innerHTML = `<b style="color: Maroon;">Tendencia NO3:</b> ${datos.tendNO3}`;
    document.getElementById("modalTendCO2").innerHTML = `<b style="color: Maroon;">Tendencia CO2:</b> ${datos.tendCO2}`;
    document.getElementById("modal-comments").value = datos.comentarios;

    // Mostrar el modal
    const modal = document.getElementById("modalEstadisticas");
    modal.style.display = "block"; // Cambiar estilo para mostrar el modal
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById("modalEstadisticas");
    modal.style.display = "none"; // Cambiar estilo para ocultar el modal

    reiniciarInputDate();
}