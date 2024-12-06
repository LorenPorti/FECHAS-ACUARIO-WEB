let chart = null; // Declaración global
document.addEventListener('DOMContentLoaded', () => {
    // inicializarGrafico();
    inicializarGraficoAG();

    actualizarNavigator(rangoNavigator.min, rangoNavigator.max);

    const botonOcultarSeries = document.getElementById('ocultar-series');

    botonOcultarSeries.addEventListener('click', event => {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace

        if (chart && chart.chart && chart.chart.series) {
            const series = chart.chart.series;

            // Actualizar la visibilidad de las series
            series.forEach(serie => {
                serie.visible = serie.properties.yKey === 'tendenciaGral';
            });

            // Forzar redibujado del gráfico
            chart.chart.update(); // Método directo para refrescar el gráfico
        } else {
            console.error('No se pudo acceder a las series del gráfico.');
        }
    });

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

    document.getElementById('irAFecha').addEventListener('click', (event) => {
        event.preventDefault();

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
            const selectedDateString = dateToFormattedString(selectedDate);


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

            // Calcular los valores del navigator
            const index = datosAcuario.findIndex(d => d.Fecha.replace(".", "") === selectedDateString);
            if (index !== -1) {
                const totalDatos = datosAcuario.length;
                const rangoNavigator = {
                    min: Math.max(0, index - 51) / totalDatos, // Un año antes
                    max: Math.min(1, (index + 1) / totalDatos) // Incluir el dato seleccionado
                };

                actualizarNavigator(rangoNavigator.min, rangoNavigator.max);
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

            // // Reiniciar el campo de fecha
            // if (oldDateInput) {
            //     const newDateInput = oldDateInput.cloneNode(true); // Clonar el input original
            //     oldDateInput.parentNode.replaceChild(newDateInput, oldDateInput); // Reemplazar el viejo con el nuevo
            //     newDateInput.value = ""; // Asegurar que esté vacío
            // }

            // mensajeContenedor.style.display = "none";

            // // Asegurarse de que el contenedor del selector de fecha esté oculto
            // if (dateInputContainer) {
            //     dateInputContainer.style.display = "none";
            // }
            reiniciarInputDate();
        }, 4000);
    }

    function obtenerFechaSeleccionada() {
        const inputFecha = document.getElementById('fechaInput'); // ID del input
        return inputFecha ? inputFecha.value : null;
    }

    // // Esperar brevemente antes de ocultar las series
    // setTimeout(() => {
    //     const series = chart.chart.series;
    //     const tendenciaCO2 = series.find(s => s.properties.yKey === 'tendenciaCO2');
    //     const tendenciaNO3 = series.find(s => s.properties.yKey === 'tendenciaNO3');

    //     if (tendenciaCO2) tendenciaCO2.visible = false;
    //     if (tendenciaNO3) tendenciaNO3.visible = false;

    //     chart.chart.update(chart, {
    //         series: chart.chart.series,
    //     });
    // }, 100); // Ajusta el tiempo si es necesario

    // // Configurar eventos solo si el gráfico está inicializado
    // if (chart) {
    //     const toggleTendenciaCO2 = document.getElementById('toggleTendenciaCO2');
    //     const toggleTendenciaNO3 = document.getElementById('toggleTendenciaNO3');

    //     toggleTendenciaCO2.addEventListener('change', () => {
    //         actualizarVisibilidadSerie('tendenciaCO2', toggleTendenciaCO2.checked);
    //     });

    //     toggleTendenciaNO3.addEventListener('change', () => {
    //         actualizarVisibilidadSerie('tendenciaNO3', toggleTendenciaNO3.checked);
    //     });
    // } else {
    //     console.error("El gráfico no se pudo inicializar correctamente.");
    // }
});

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

const datosAcuario = JSON.parse(localStorage.getItem('datosAcuario'));

let rangoNavigator = {
    min: (datosAcuario.length - 52) / datosAcuario.length,
    max: 1, // Mostrar un año al inicio
};

function actualizarNavigator(minimo, maximo) {
    const totalDatos = datosAcuario.length;

    // Asegurar que los valores estén dentro de los límites
    if (minimo < 0) minimo = 0;
    if (maximo > 1) maximo = 1;

    // Calcular el tamaño mínimo permitido para el rango (1 dato como mínimo)
    const rangoMinimo = 1 / totalDatos;

    // Si el rango especificado es menor que el mínimo, expandirlo automáticamente
    if (maximo - minimo < rangoMinimo) {
        maximo = Math.min(minimo + rangoMinimo, 1); // Aumentar el rango hacia el final
        minimo = Math.max(maximo - rangoMinimo, 0); // Reducir el rango hacia el inicio si necesario
    }

    // Actualizar los valores del navigator
    chart.chart.navigator.min = minimo;
    chart.chart.navigator.max = maximo;

    // Refrescar el gráfico
    chart.chart.update();
}

function inicializarGraficoAG() {

    if (!datosAcuario || datosAcuario.length === 0) {
        console.error("No se encontraron datos en 'datosAcuario'");
        return;
    }

    const fechas = obtenerFechasDeDatosAcuario();
    const valoresPH = datosAcuario.map(dato => dato.pH);
    const valoresKH = datosAcuario.map(dato => dato.KH);
    const valoresNO3 = datosAcuario.map(dato => dato.NO3);
    const valoresCO2 = datosAcuario.map(dato => dato.CO2);
    const valorestemp = datosAcuario.map(dato => dato.temp);
    const valorestendenciaGral = datosAcuario.map(dato => dato.resultado);
    // Cálculo de la regresión polinómica de grado 3.
    const xValores = fechas.map((_, index) => index); // Índices como eje X
    const coeficientesTendenciaCO2 = calcularRegresionPolinomica(xValores, valoresCO2, 3);
    const coeficientesTendenciaGral = calcularRegresionPolinomica(xValores, valorestendenciaGral, 3);
    const coeficientesTendenciaNO3 = calcularRegresionPolinomica(xValores, valoresNO3, 3);

    // Generar los valores ajustados de tendencia usando el polinomio
    const valoresAjustadosCO2 = xValores.map(x => evaluarPolinomio(coeficientesTendenciaCO2, x));
    const valoresAjustadosTendenciaGral = xValores.map(x => evaluarPolinomio(coeficientesTendenciaGral, x));
    const valoresAjustadosNO3 = xValores.map(x => evaluarPolinomio(coeficientesTendenciaNO3, x));


    //Selecciona los 20 primeros
    let dataSeleccion = fechas.slice(0, datosAcuario.length - 1).map((fecha, i) => ({
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

    chart = agCharts.AgCharts.create({
        container: document.getElementById('graficoLineas'),
        autoSize: true, // Ajuste automático del tamaño
        // title: {
        //     text: 'Datos del Acuario',
        //     fontSize: 18,
        // },
        data: dataSeleccion,
        series: [{
                type: 'line',
                xKey: 'fecha',
                yKey: 'pH',
                yName: 'pH',
                stroke: 'blue',
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: 'blue', // Color del botón en la leyenda para esta serie 
                    size: 0, //Elimina los marcadores de los nodos
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>pH: ${params.datum.pH} eje Izda`,
                        backgroundColor: 'blue', // Color de fondo igual al de la serie
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'KH',
                yName: 'KH',
                stroke: 'green',
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: 'green', // Color del botón en la leyenda para esta serie
                    size: 0, //Elimina los marcadores de los nodos
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>KH: ${params.datum.KH} (dKH) eje Izda`,
                        backgroundColor: 'green', // Color de fondo igual al de la serie
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'CO2',
                yName: 'CO2',
                stroke: 'DeepSkyBlue',
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: 'DeepSkyBlue', // Color del botón en la leyenda para esta serie
                    size: 0, //Elimina los marcadores de los nodos
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>CO2: ${params.datum.CO2.toFixed(2).replace(".",",")} (mg/l) eje Dcha`,
                        backgroundColor: 'DeepSkyBlue', // Color de fondo igual al de la serie
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'NO3',
                yName: 'NO3',
                stroke: '#C96868',
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: '#C96868', // Color del botón en la leyenda para esta serie
                    size: 0, //Elimina los marcadores de los nodos
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>NO3: ${params.datum.NO3.toFixed(2).replace(".",",")} (ppm) eje Dcha`,
                        backgroundColor: '#C96868', // Color de fondo igual al de la serie
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'temp',
                yName: 'temp',
                stroke: '#DEAA79',
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: '#DEAA79', // Color del botón en la leyenda para esta serie
                    size: 0, //Elimina los marcadores de los nodos
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>temp: ${params.datum.temp} ºC eje Dcha`,
                        backgroundColor: '#DEAA79', // Color de fondo igual al de la serie
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'tendenciaGral',
                yName: 'Tendencia Gral',
                stroke: 'Purple',
                strokeWidth: 4,
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: 'Purple', // Color del botón en la leyenda para esta serie
                    size: 0, //Elimina los marcadores de los nodos
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>Tendencia Gral: ${params.datum.tendenciaGral.toFixed(2).replace(".",",")} eje Izda`,
                        backgroundColor: 'Purple', // Color de fondo igual al de la serie
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'tendenciaCO2',
                yName: 'Tendencia CO2',
                stroke: '#2e86c1',
                strokeWidth: 3,
                lineDash: [10, 5],
                visible: false,
                // showInLegend: false, // Oculta esta serie en la leyenda
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: '#2e86c1',
                    size: 0,
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>Tendencia CO2: ${params.datum.tendenciaCO2.toFixed(2).replace(".",",")} eje Dcha`,
                        backgroundColor: '#2e86c1',
                    }),
                },
            },
            {
                type: 'line',
                xKey: 'fecha',
                yKey: 'tendenciaNO3',
                yName: 'Tendencia NO3',
                stroke: '#943126',
                strokeWidth: 3,
                lineDash: [10, 5],
                visible: false,
                interpolation: {
                    type: 'smooth'
                },
                marker: {
                    fill: '#943126',
                    size: 0,
                },
                tooltip: {
                    renderer: (params) => ({
                        content: `Fecha: ${params.datum.fecha}<br>Tendencia NO3: ${params.datum.tendenciaNO3.toFixed(0)} eje Dcha`,
                        backgroundColor: '#943126',
                    }),
                },
            },
        ],
        axes: [{
                type: 'category',
                position: 'bottom',
                title: { text: 'Fechas' },
                key: 'Fecha',
                interval: {
                    maxSpacing: 52,
                },
                label: {
                    rotation: 270,
                    fontSize: 10, // Reducir el tamaño de la fuente en pantallas pequeñas
                    formatter: (params) => {
                        const index = datosAcuario.findIndex(dato => dato.Fecha === params.value);

                        // Mostrar solo la fecha en el primer valor de cada año (cada 52 elementos) o cada x intervalos
                        return index % 52 === 0 || index % 4 === 0 ? params.value : '';
                    },
                },
                tick: {
                    maxSpacing: 60, // Ajusta el espacio máximo entre las etiquetas
                },
            },
            {
                type: 'number',
                position: 'left',
                // title: { text: 'pH - KH (dKH)' },
                keys: ['pH', 'KH', "tendenciaGral", ], // Asociar ejes a estas series
                gridLine: {
                    enabled: true,
                    style: [{
                            stroke: 'gray',
                            lineDash: [10, 5],
                        },
                        {
                            stroke: 'lightgray',
                            lineDash: [5, 5],
                        },
                    ],
                },
                min: 0,
                max: 10,
                interval: { step: 0.5, },

            },
            {
                type: 'number',
                position: 'right',
                // title: { text: 'NO3 (ppm)' },
                keys: ['NO3', 'CO2', 'temp', "tendenciaCO2", "tendenciaNO3"], // Asociar eje a esta serie
                // gridLine: {
                //     enabled: true,
                //     style: [
                //         { stroke: 'red', lineDash: [4, 4], }, // Línea punteada roja
                //     ],
                // },
                interval: { step: 20, },
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
            handles: {
                visible: true, // Deshabilitar los controles laterales
            },
            mask: {
                fill: '#705C53', // Color de la selección
            },
        },
    });

    // // Actualizamos el gráfico para reflejar los cambios
    // chart.chart.update(chart, {
    //     series: chart.chart.series
    // });
}

// function actualizarVisibilidadSerie(yKey, visible) {
//     if (!chart) return;

//     const series = chart.chart.series;
//     const serie = series.find(serie => serie.properties.yKey === yKey);

//     if (serie) {
//         serie.visible = visible; // Actualiza la visibilidad de la serie
//     } else {
//         console.warn(`No se encontró ninguna serie con yKey "${yKey}"`);
//     }
// }

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
    const datosAcuario = JSON.parse(localStorage.getItem('datosAcuario'));

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

// Ejemplo para ambos ejes
// generarLeyendaVertical("izquierda", ["10", "8", "6", "4", "2", "0"]);
// generarLeyendaVertical("derecha", ["50", "40", "30", "20", "10", "0"]);