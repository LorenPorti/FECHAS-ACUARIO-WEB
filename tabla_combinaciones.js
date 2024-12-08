// Cargar los datos desde localStorage
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));

// Verificar que los datos se cargan correctamente
if (!datosAcuario) {
    console.log("No se encontraron datos en localStorage.");
} else {
    console.log("Datos cargados correctamente:", datosAcuario);
}

// Función para generar la tabla de combinaciones de plantas y algas
function generarTablaCombinaciones() {
    const tabla = document.getElementById('tabla-plants-algas').getElementsByTagName('tbody')[0];

    // Limpiar la tabla antes de agregar nuevas filas
    tabla.innerHTML = '';

    // Iterar sobre las posibles combinaciones de plantas (0-3) y algas (0-3)
    for (let plantas = 0; plantas <= 3; plantas++) {
        const fila = document.createElement('tr');

        // Crear una celda con el texto de "Plantas"
        const celdaPlantas = document.createElement('td');
        celdaPlantas.textContent = getEstado('plantas', plantas); // Mostrar el estado de las plantas
        fila.appendChild(celdaPlantas);

        // Iterar sobre las posibles combinaciones de algas (0-3)
        for (let algas = 0; algas <= 3; algas++) {
            // Obtener la frecuencia de la combinación plantas/algas
            const frecuencia = obtenerFrecuencia(plantas, algas);

            // Crear una celda para mostrar la frecuencia
            const celda = document.createElement('td');
            celda.textContent = frecuencia > 0 ? `(${frecuencia})` : '-'; // Mostrar la frecuencia de la combinación

            // Asignar valores de plantas y algas como atributos de datos a la celda
            celda.dataset.plantas = plantas; // Asignar datos de plantas a la celda
            celda.dataset.algas = algas; // Asignar datos de algas a la celda

            // Establecer el cursor a mano (pointer) en los cruces de la tabla
            celda.style.cursor = 'pointer'; // Cambiar el cursor a mano en los cruces

            // Agregar el evento al hacer clic en la celda
            celda.addEventListener('click', manejarClickCelda);

            fila.appendChild(celda);
        }

        // Agregar la fila a la tabla
        tabla.appendChild(fila);
    }
}

// Función que maneja el clic en la celda
function manejarClickCelda(event) {
    // Obtener los valores de plantas y algas desde el dataset
    const plantas = event.target.dataset.plantas;
    const algas = event.target.dataset.algas;

    // Selecciona todas las celdas de la tabla y las pone de color negro
    document.querySelectorAll("#tabla-plants-algas td").forEach(c => {
        c.style.color = "black";
    });

    //resalta el color de la celda seleccionada
    if (event.target.textContent != "-") event.target.style.color = "red";

    // Llamar a la función de selección de combinación
    seleccionarCombinacion(plantas, algas);
}

// Función para manejar la selección de una combinación en la tabla
function seleccionarCombinacion(plantas, algas) {
    const dropdown = document.getElementById('dropdown-fechas');
    const cabecera = document.getElementById('cabecera-combinaciones');
    dropdown.innerHTML = '<option value="">Seleccione fecha</option>'; // Limpiar el dropdown antes de llenarlo

    // Obtener el estado de las plantas y algas para mostrar en el encabezado
    const estadoPlantas = getEstado('plantas', plantas);
    const estadoAlgas = getEstado('algas', algas);

    // Filtrar los datos que coinciden con la combinación seleccionada
    const combinacionesFiltradas = datosAcuario.filter(dato => {
        const plantasValor = Number(dato.plantas);
        const algasValor = Number(dato.algas);
        return plantasValor === Number(plantas) && algasValor === Number(algas);
    });

    // Verificar si hay combinaciones
    if (combinacionesFiltradas.length === 0) {
        const opcionVacia = document.createElement('option');
        opcionVacia.textContent = 'Sin resultados';
        opcionVacia.disabled = true;
        opcionVacia.selected = true;
        dropdown.appendChild(opcionVacia);
        cabecera.textContent = `Sin combin. ${estadoPlantas}/${estadoAlgas}`;
        return;
    }

    // Actualizar la cabecera con los estados seleccionados
    cabecera.textContent = `Fechas combin. ${estadoPlantas}/${estadoAlgas}`;

    // Agregar una opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    // optionDefault.textContent = 'Selecciona una fecha';
    optionDefault.disabled = true;
    optionDefault.selected = true;
    // dropdown.appendChild(optionDefault);

    // Rellenar el dropdown con las fechas correspondientes
    combinacionesFiltradas.forEach(dato => {
        const opcion = document.createElement('option');
        opcion.value = dato.Fecha; // Usar la fecha como valor
        opcion.textContent = dato.Fecha; // Mostrar la fecha en el dropdown
        dropdown.appendChild(opcion);
    });
}


// Función para obtener las fechas para una combinación específica
function obtenerFechas(plantas, algas) {
    // Filtrar los datos según las plantas y algas y extraer las fechas
    return datosAcuario
        .filter(dato => dato.plantas === plantas && dato.algas === algas)
        .map(dato => dato.fecha); // Suponiendo que cada objeto en datosAcuario tiene una propiedad "fecha"
}

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

function obtenerFrecuencia(plantas, algas) {
    // Verificar que datosAcuario es un array válido
    if (!Array.isArray(datosAcuario)) {
        console.error("datosAcuario no es un array válido.");
        return 0;
    }

    // Convertir plantas y algas a números
    const plantasNumero = parseInt(plantas, 10);
    const algasNumero = parseInt(algas, 10);

    console.log("Entradas convertidas - Plantas:", plantasNumero, "Algas:", algasNumero);
    console.log("Estructura de datosAcuario:", datosAcuario);

    // Filtrar las combinaciones que coincidan
    const combinacionesFiltradas = datosAcuario.filter(dato => {
        const plantasValor = Number(dato.plantas); // Asegurar que es número
        const algasValor = Number(dato.algas); // Asegurar que es número

        console.log(`Comparando: plantas(${plantasValor}) === ${plantasNumero}, algas(${algasValor}) === ${algasNumero}`);
        return plantasValor === plantasNumero && algasValor === algasNumero;
    });

    // Mostrar el resultado del filtro
    console.log("Combinaciones filtradas:", combinacionesFiltradas);

    // Retornar la longitud del resultado
    return combinacionesFiltradas.length;
}


// Llamar a la función cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('dropdown-fechas');
    dropdown.innerHTML = ''; // Limpiar el dropdown inicialmente

    // Crear la opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecciona fecha';
    optionDefault.disabled = true;
    optionDefault.selected = true;
    dropdown.appendChild(optionDefault);

    // Generar combinaciones y agregar eventos
    generarTablaCombinaciones();

    document.querySelectorAll('input[type="radio"][name="combinacion"]').forEach(radio => {
        radio.addEventListener('change', function() {
            actualizarDropdown(this.value);
        });
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
        diferenciaEstado = "ESTABLE ";
        signo = "±";
    } else {
        dato1 = datosAcuario[indice - 1].tendencia.toFixed(3);
        dato2 = datosAcuario[indice].tendencia.toFixed(3);
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

    document.getElementById("modal-datos").innerHTML = `» La diferencia con valores anteriores de la regresión lineal Gral es <b style="color: Maroon; font-style: italic; ">${diferenciaEstado}</b>(${signo}${(dato2-dato1).toFixed(3).replace(".",",")}).`;
    document.getElementById("modalPH").innerHTML = `<b style="color: Maroon;">pH:</b> ${valDatos.pH.toFixed(1).toString().replace(".", ",")}`;
    document.getElementById("modalKH").innerHTML = `<b style="color: Maroon;">KH:</b> ${valDatos.KH} dKH`;
    document.getElementById("modalTemp").innerHTML = `<b style="color: Maroon; ">Temperatura:</b> ${valDatos.temp} ºC`;
    document.getElementById("modalCO2").innerHTML = `<b style="color: Maroon; ">CO2:</b> ${valDatos.CO2.toFixed(2).toString().replace(".", ",")} mg/l`;
    document.getElementById("modalNO3").innerHTML = `<b style="color: Maroon; ">NO3:</b> ${valDatos.NO3} ppm`;
    document.getElementById("modalPlantas").innerHTML = `<b style="color: Maroon; ">Plantas:</b> ${getEstado("plantas", valDatos.plantas)}`;
    document.getElementById("modalAgua").innerHTML = `<b style="color: Maroon; ">Agua:</b> ${getEstado("agua", valDatos.agua)}`;
    document.getElementById("modalAlgas").innerHTML = `<b style="color: Maroon; ">Algas:</b> ${getEstado("algas", valDatos.algas)}`;
    document.getElementById("modalSupAgua").innerHTML = `<b style="color: Maroon; ">Superf. agua:</b> ${getEstado("supAgua", valDatos.sup_agua)}`;
    document.getElementById("modalInyCO2").innerHTML = `<b style="color: Maroon; ">Inyección de CO2:</b> ${getEstado("inyCO2", valDatos.inyeccCO2)}`;
    document.getElementById("modalTendGral").innerHTML = `<b style="color: Maroon; ">Regresión lineal Gral:</b> ${valDatos.tendencia.toFixed(3).toString().replace(".", ",")} - (Óptimo = 0,000)`;
    document.getElementById("modalTendNO3").innerHTML = `<b style="color: Maroon; ">Regresión lineal NO3:</b> ${calcularTendencia(datosAcuario,1,indice).replace(".", ",")} - (Ópt. = 5-10 ppm)`;
    document.getElementById("modalTendCO2").innerHTML = `<b style="color: Maroon; ">Regresión lineal CO2:</b> ${calcularTendencia(datosAcuario, 2, indice).replace(".", ",")} - (Ópt. = 6-15 mg/l)`;
    console.log(calcularTendencia(datosAcuario, 2, indice));
    document.getElementById("modal-comments").textContent = `${valDatos.comentario}`;

    modal.style.display = "block";
}

const dropdownCombiPlantasAlgas = document.getElementById("dropdown-fechas");

const dropdown = document.getElementById("dropdown-fechas");

dropdownCombiPlantasAlgas.addEventListener("change", (event) => {
    const selectedDate = event.target.value.trim();
    if (selectedDate) {
        actualizarModal(selectedDate); // Mostrar el modal
    }
});

dropdown.addEventListener("change", (event) => {
    const selectedDate = event.target.value.trim();

    // Si hay una fecha seleccionada, mostramos el modal
    if (selectedDate) {
        actualizarModal(selectedDate);

        // Resetear temporalmente el valor del dropdown
        setTimeout(() => {
            dropdown.selectedIndex = 0; // Vuelve a "Selecciona fecha"
        }, 100); // Espera breve para permitir al usuario reabrir el modal
    }
});


// Cerrar el modal
function cerrarModal() {
    const modal = document.getElementById("modalEstadisticas");
    modal.style.display = "none";
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modalEstadisticas");
    if (event.target === modal) {
        cerrarModal();
    }
});

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