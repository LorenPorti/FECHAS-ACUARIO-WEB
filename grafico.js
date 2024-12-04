let chart = null; // Declaración global
document.addEventListener('DOMContentLoaded', () => {
    // inicializarGrafico();
    inicializarGraficoAG();

    // Esperar brevemente antes de ocultar las series
    setTimeout(() => {
        const series = chart.chart.series;
        const tendenciaCO2 = series.find(s => s.properties.yKey === 'tendenciaCO2');
        const tendenciaNO3 = series.find(s => s.properties.yKey === 'tendenciaNO3');

        if (tendenciaCO2) tendenciaCO2.visible = false;
        if (tendenciaNO3) tendenciaNO3.visible = false;

        chart.chart.update(chart, {
            series: chart.chart.series,
        });
    }, 100); // Ajusta el tiempo si es necesario

    // Configurar eventos solo si el gráfico está inicializado
    if (chart) {
        const toggleTendenciaCO2 = document.getElementById('toggleTendenciaCO2');
        const toggleTendenciaNO3 = document.getElementById('toggleTendenciaNO3');

        toggleTendenciaCO2.addEventListener('change', () => {
            actualizarVisibilidadSerie('tendenciaCO2', toggleTendenciaCO2.checked);
        });

        toggleTendenciaNO3.addEventListener('change', () => {
            actualizarVisibilidadSerie('tendenciaNO3', toggleTendenciaNO3.checked);
        });
    } else {
        console.error("El gráfico no se pudo inicializar correctamente.");
    }
});

const datosAcuario = JSON.parse(localStorage.getItem('datosAcuario'));

let rangoFijo = {
    min: 0,
    max: 1, // Mostrar un año al inicio
};

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
                visible: true,
                showInLegend: false, // Oculta esta serie en la leyenda
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
                visible: true,
                showInLegend: false, // Oculta esta serie en la leyenda
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
            min: rangoFijo.min,
            max: rangoFijo.max,
            handles: {
                visible: false, // Deshabilitar los controles laterales
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

function actualizarVisibilidadSerie(yKey, visible) {
    if (!chart) return;

    const series = chart.chart.series;
    const serie = series.find(serie => serie.properties.yKey === yKey);

    if (serie) {
        serie.visible = visible; // Actualiza la visibilidad de la serie
    } else {
        console.warn(`No se encontró ninguna serie con yKey "${yKey}"`);
    }
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

// Ejemplo para ambos ejes
// generarLeyendaVertical("izquierda", ["10", "8", "6", "4", "2", "0"]);
// generarLeyendaVertical("derecha", ["50", "40", "30", "20", "10", "0"]);