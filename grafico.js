document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafico();
});

const crosshairPlugin = {
    id: 'crosshair',
    afterEvent: function(chart, event) {
        if (event.type !== 'mousemove') return;

        const ctx = chart.ctx;
        const x = event.x;
        const y = event.y;
        const xScale = chart.scales['x'];
        const yLeftScale = chart.scales['yLeft'];
        const yRightScale = chart.scales['yRight'];

        // Limpiar el canvas antes de dibujar el nuevo crosshair
        ctx.clearRect(0, 0, chart.width, chart.height);

        // Dibuja la línea vertical
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, chart.height);
        ctx.strokeStyle = 'gray'; // Línea vertical gris
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Línea discontinua
        ctx.stroke();
        ctx.restore();

        // Dibuja la línea horizontal para el eje izquierdo (yLeft)
        const yLeftValue = yLeftScale.getValueForPixel(y);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chart.width, y);
        ctx.strokeStyle = 'blue'; // Línea horizontal azul (eje izquierdo)
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Línea discontinua
        ctx.stroke();
        ctx.restore();

        // Dibuja la línea horizontal para el eje derecho (yRight)
        const yRightValue = yRightScale.getValueForPixel(y);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, yLeftScale.getPixelForValue(yLeftValue)); // Ajustar para el eje izquierdo
        ctx.lineTo(chart.width, yRightScale.getPixelForValue(yRightValue));
        ctx.strokeStyle = 'red'; // Línea horizontal roja (eje derecho)
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Línea discontinua
        ctx.stroke();
        ctx.restore();
    }
};


function inicializarGrafico() {
    const ctx = document.getElementById('graficoLineas').getContext('2d');
    const fechas = obtenerFechasDeDatosAcuario(); // Fechas en el eje X
    const valoresPH = obtenerValores('pH'); // Valores de pH para el eje izquierdo
    const valoresKH = obtenerValores('KH'); // Valores de KH para el eje izquierdo
    const valoresNO3 = obtenerValores('NO3'); // Valores de KH para el eje izquierdo

    if (fechas.length === 0 || valoresPH.length === 0 || valoresKH.length === 0) {
        console.error("No hay datos suficientes para mostrar el gráfico.");
        return;
    }

    // Calculamos dinámicamente el rango del eje izquierdo
    // const minLeft = Math.min(...valoresPH, ...valoresKH);
    // const maxLeft = Math.max(...valoresPH, ...valoresKH);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas.slice(0, 40), // Fechas para las primeras 5 semanas
            datasets: [{
                    label: 'pH', // Eliminamos la leyenda específica del dataset
                    data: valoresPH.slice(0, 52), // Los primeros 5 valores de pH
                    borderColor: 'blue',
                    borderWidth: 2,
                    tension: 0.2, // Suavidad de la línea
                    yAxisID: 'yLeft', // Se conecta con el eje izquierdo
                    pointRadius: 0, // Sin puntos visibles
                    hidden: false, // Por defecto, visible
                },
                {
                    label: 'KH', // Eliminamos la leyenda específica del dataset
                    data: valoresKH.slice(0, 52), // Los primeros 5 valores de KH
                    borderColor: 'green',
                    borderWidth: 2,
                    tension: 0.2, // Suavidad de la línea
                    yAxisID: 'yLeft', // También se conecta con el eje izquierdo
                    pointRadius: 0, // Sin puntos visibles
                    hidden: false, // Por defecto, visible
                },
                {
                    label: 'NO3', // Eliminamos la leyenda específica del dataset
                    data: valoresNO3.slice(0, 52), // Los primeros 5 valores de KH
                    borderColor: 'maroon',
                    borderWidth: 2,
                    tension: 0.2, // Suavidad de la línea
                    yAxisID: 'yRight', // También se conecta con el eje izquierdo
                    pointRadius: 0, // Sin puntos visibles
                    hidden: false, // Por defecto, visible
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest', // Se asegura que el crosshair afecta a ambos ejes al pasar por encima
                intersect: false, // Permite que el crosshair funcione incluso cuando el cursor no está sobre un punto específico
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.dataset.yAxisID === 'yRight') {
                                // Color asociado al eje derecho
                                return `${label}: ${context.raw} (Eje Derecho - Rojo)`;
                            } else {
                                return `${label}: ${context.raw} (Eje Izquierdo - Gris)`;
                            }
                        },
                        labelColor: function(context) {
                            if (context.dataset.yAxisID === 'yRight') {
                                return { borderColor: 'red', backgroundColor: 'red' };
                            } else {
                                return { borderColor: 'gray', backgroundColor: 'gray' };
                            }
                        },
                    },
                },
                crosshair: {
                    line: {
                        color: 'black', // Color del cursor
                        width: 1, // Grosor del cursor                        
                    },
                    sync: {
                        enabled: false, // Sincronización con otros gráficos (si tienes varios)
                    },
                    zoom: {
                        enabled: false, // Desactiva el zoom al mover el cursor
                    },
                    callbacks: {
                        afterDraw: function(chart) {
                            // Opcional: personalizar acciones después de dibujar el cursor
                        },
                    },
                },
                legend: {
                    display: true, // Mostrar la leyenda
                    labels: {
                        color: 'black', // Color del texto de la leyenda
                    },
                    onClick: (event, legendItem, legend) => {
                        const datasetIndex = legendItem.datasetIndex; // Índice del dataset
                        const meta = chart.getDatasetMeta(datasetIndex); // Metadatos del dataset
                        meta.hidden = !meta.hidden; // Cambiar visibilidad
                        chart.update(); // Actualizar el gráfico
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fechas'
                    }
                },
                yLeft: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'pH - KH (dKH)' // Leyenda del eje izquierdo
                    },
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 0.5,
                    },
                    grid: {
                        color: 'gray',
                        lineWidth: 1,
                    }
                },
                yRight: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CO2 (mg/l) - Temp. (ºC) - NO3 (ppm)',
                        color: 'red',
                    },
                    min: 0,
                    max: 50,
                    ticks: {
                        display: true,
                        stepSize: 1,
                        color: 'red',
                    },
                    grid: {
                        color: 'red',
                        lineWidth: 1,
                    },
                }
            }
        }
    });

    // return chart; // Por si necesitas manipularlo posteriormente
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

function obtenerValores(parametro) {
    // Obtén los datos del localStorage
    const datosAcuario = JSON.parse(localStorage.getItem('datosAcuario'));
    let valores;

    if (!datosAcuario || datosAcuario.length === 0) {
        console.error("No se encontraron datos en 'datosAcuario'");
        return [];
    }

    switch (parametro) {
        case 'pH':
            valores = datosAcuario.map(dato => dato.pH);
            break;
        case 'KH':
            valores = datosAcuario.map(dato => dato.KH);
            break;
        case 'NO3':
            valores = datosAcuario.map(dato => dato.KH);
            break;
    }
    // Extrae los valores de pH
    return valores;
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