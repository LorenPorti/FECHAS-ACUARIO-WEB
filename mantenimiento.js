// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));

// Insertar el título del acuario en la cabecera
document.getElementById("tituloAcuario").textContent = dataConfig.nombreDelAcuario;

// Función para llenar las filas de la cuadrícula
function llenarCuadrilla() {
    const tablaCuerpo = document.querySelector(".tabla-cuerpo");
    tablaCuerpo.innerHTML = ""; // Limpiar cualquier contenido existente

    datosAcuario.forEach((datosFila) => {
        const fila = document.createElement("div");
        fila.classList.add("fila");

        // Crear columna de fecha
        const columnaFecha = document.createElement("div");
        columnaFecha.classList.add("fecha", "celda", "select-no");
        columnaFecha.textContent = datosFila.Fecha; // Usar datosAcuario.Fecha
        fila.appendChild(columnaFecha);

        // Crear columnas de tareas
        for (let i = 1; i <= 5; i++) {
            const tareaKey = `tarea${i}`;
            const celda = document.createElement("div");
            celda.classList.add("celda", "select-no");

            let tarea = datosFila[tareaKey] || ""; // Obtener la tarea o usar una cadena vacía
            if (tarea.startsWith("§")) {
                tarea = tarea.slice(1); // Eliminar el carácter '§'
                celda.textContent = `(√) ${tarea}`;
                celda.classList.add("task-completed");
            } else {
                celda.textContent = tarea;
            }

            fila.appendChild(celda);
        }

        tablaCuerpo.appendChild(fila); // Agregar la fila al cuerpo de la tabla
    });
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    llenarCuadrilla();
});

document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar todas las celdas y asignar el evento
    document.querySelectorAll(".celda").forEach((celda) => {
        celda.addEventListener("click", () => {
            const fila = celda.parentElement; // Obtén la fila a la que pertenece la celda
            const modalContenido = document.getElementById("contenidoCeldaModal");
            // Obtener la tarea y la fecha desde la fila
            const fecha = fila.querySelector(".celda.fecha").textContent.trim(); // Asume que una celda tiene clase 'fecha'
            // Obtener el índice de la celda en la fila
            const indiceCelda = Array.from(fila.children).indexOf(celda);

            const encabezados = document.querySelectorAll(".tabla-encabezado .columna-fija");
            let tarea = `Tarea ${indiceCelda}`; // Valor por defecto
            if (encabezados[indiceCelda]) {
                tarea = encabezados[indiceCelda].textContent.trim();
            }

            const modalTitulo = document.getElementById('modalTextoCeldaLabel');

            let contenido;

            if (celda.textContent.trim().substring(0, 3) == "(√)") contenido = `${fecha} - ${celda.textContent.trim().split("(√)")[1]} - Tarea realizada`;
            else contenido = `${fecha} - ${celda.textContent.trim()} - Tarea NO realizada`;

            modalTitulo.textContent = `${tarea}`;

            modalContenido.textContent = contenido || "Sin contenido"; // Maneja celdas vacías

            // Inicializar y mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("modalTextoCelda"));

            if (celda.textContent.trim() != "" && indiceCelda != 0) modal.show(); //Mostrar el modal sólo si tiene contenido o no es la columna fecha

            // Resaltar la fila seleccionada
            document.querySelectorAll(".tabla-cuerpo .fila").forEach(f => f.classList.remove("fila-seleccionada"));
            fila.classList.add("fila-seleccionada");
        });
    });
});

// Convierte un valor Date al formato "17 jul. 2024"
function formatDate(dateString) {
    // Convertir la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    const months = [
        "ene.",
        "feb.",
        "mar.",
        "abr.",
        "may.",
        "jun.",
        "jul.",
        "ago.",
        "sep.",
        "oct.",
        "nov.",
        "dic.",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

//Convertir un string de la forma '3 ago.2024' a Date
function convertirFechaString(fechaString) {
    // Crear un mapa de meses en español con sus índices
    const meses = {
        'ene.': 0,
        'feb.': 1,
        'mar.': 2,
        'abr.': 3,
        'may.': 4,
        'jun.': 5,
        'jul.': 6,
        'ago.': 7,
        'sep.': 8,
        'oct.': 9,
        'nov.': 10,
        'dic.': 11
    };

    // Dividir el string en sus componentes
    const [dia, mesAbrev, año] = fechaString.split(' ');

    // Obtener el índice del mes desde el mapa
    const mes = meses[mesAbrev.toLowerCase()];

    if (mes === undefined) {
        throw new Error("Mes no válido en la fecha proporcionada.");
    }

    // Crear y devolver un objeto Date
    return new Date(parseInt(año, 10), mes, parseInt(dia, 10));
}

// URL base de GitHub para los archivos JSON
const githubBaseUrl = "https://raw.githubusercontent.com/LorenPorti/FECHAS-ACUARIO-WEB/main/"; // Reemplaza con la URL base de tu repositorio

let tareasJSON = [];

document.addEventListener("DOMContentLoaded", () => {
    const numAcuario = localStorage.getItem('numAcuario');
    let fileName = `acuarioNum${numAcuario}Manten.json`;
    let fileUrl = `${githubBaseUrl}${fileName}`; // URL completa para el archivo en GitHub    

    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo ${fileName} desde GitHub`);
            }
            return response.json();
        })
        .then(jsonData => {
            tareasJSON = jsonData; // Asignar datos a la variable global

            // Guardamos los datos del acuario (data) en localStorage
            localStorage.setItem("datosAcuarioManten", JSON.stringify(tareasJSON));

        })
        .catch(error => console.log(`Error al cargar el archivo:`, error));
});

document.addEventListener("DOMContentLoaded", () => {
    const filas = document.querySelectorAll(".tabla-cuerpo .fila");

    // Añadir evento de clic a cada fila
    filas.forEach((fila, indiceFila) => {
        fila.dataset.indice = indiceFila; // Agregar índice a cada fila
        fila.addEventListener("click", () => {
            seleccionarFila(fila, filas);
        });
    });

    // Seleccionar la última fila automáticamente al cargar la tabla
    if (filas.length > 0) {
        setTimeout(() => {

            const ultimaFila = filas[filas.length - 1];
            ultimaFila.scrollIntoView({ behavior: "instant", block: "center" }); // Asegura visibilidad
            seleccionarFila(ultimaFila, filas);
        }, 300); // Retraso mínimo para asegurar que la cuadrícula esté lista
    }

});

function seleccionarFila(fila, filas) {
    // Resaltar la fila seleccionada
    document.querySelectorAll(".tabla-cuerpo .fila").forEach(f => f.classList.remove("fila-seleccionada"));
    fila.classList.add("fila-seleccionada");

    // Obtener el índice de la fila seleccionada
    const indiceActual = parseInt(fila.dataset.indice, 10);
    const fechaTexto = fila.querySelector(".celda.fecha").textContent.trim();
    const fechaSeleccionada = convertirFechaString(fechaTexto);
    if (!fechaSeleccionada) return;

    let mensajeGeneral = `<strong style="padding-left: 2px;">Próximas tareas desde la fila seleccionada:</strong><br>`;

    // Recorrer todas las celdas de la fila (excepto la columna Fecha)
    fila.querySelectorAll(".celda:not(.fecha)").forEach((celda, indiceColumna) => {
        let mensaje = `Tarea ${indiceColumna + 1}: No hay próximas tareas`;

        // Buscar hacia adelante en las filas existentes
        let proximaOperacion = null;
        for (let i = indiceActual + 1; i < filas.length; i++) {
            const siguienteFila = filas[i];
            const celdaSiguiente = siguienteFila.querySelectorAll(".celda:not(.fecha)")[indiceColumna];
            if (celdaSiguiente && celdaSiguiente.textContent.trim()) {
                const fechaSiguiente = siguienteFila.querySelector(".celda.fecha").textContent.trim();
                proximaOperacion = {
                    tarea: celdaSiguiente.textContent.trim(),
                    fecha: fechaSiguiente
                };
                break;
            }
        }

        // Si no se encuentra operación en las filas posteriores, calcular desde tareasJSON por fechas
        if (!proximaOperacion) {

            const tareaJSON = tareasJSON[indiceColumna]; // Asumiendo que las columnas coinciden con tareasJSON

            if (tareaJSON) {
                const fechaInicio = new Date(tareaJSON.FechaInicio);
                const intervalo = tareaJSON.Intervalo * 7; // Intervalo en días
                let contador = 0;
                let ultimaFecha = new Date(fechaInicio);

                // Incrementar hasta superar la fecha de la última fila
                while (ultimaFecha <= fechaSeleccionada) {
                    ultimaFecha.setDate(ultimaFecha.getDate() + intervalo);
                    contador++;
                }

                // Calcular la próxima actividad
                // ultimaFecha.setDate(ultimaFecha.getDate() + intervalo);

                proximaOperacion = {
                    tarea: tareaJSON.Tarea,
                    fecha: formatDate(ultimaFecha)
                };
            }
        }

        if (proximaOperacion) {
            mensaje = `
                <span class="georgia-bold" style="color: maroon; padding-left: 8px; ">Tarea ${indiceColumna + 1}:</span>
                <span class="georgia-bold-italic" style="color: blue; padding-left: 5px; font-size: 15px;">${proximaOperacion.fecha}</span>
                <span class="roboto-medium-italic" style="color: gray; padding-left: 5px; font-size: 15px;">${proximaOperacion.tarea}</span>                
                `;
        }

        mensajeGeneral += mensaje + "<br>";
    });

    // Mostrar el mensaje en la parte inferior de la página
    document.getElementById("proximaOperacion").innerHTML = mensajeGeneral;
}

document.getElementById("ir-a-fecha").addEventListener("click", function(event) {

    event.preventDefault();

    const dateInputContainer = document.getElementById("dateInputContainer");
    const dateInput = document.getElementById("dateInput");

    FechaASelector(); //Poner la fecha de la selcción en el selector de fechas

    if (!dateInputContainer || !dateInput) {
        console.error("No se encontraron los elementos necesarios para mostrar el selector de fecha.");
        return;
    }

    // Posicionar el selector de fecha justo debajo de "Ir a Fecha"
    const rect = event.target.getBoundingClientRect();
    dateInputContainer.style.left = `${rect.left}px`;
    dateInputContainer.style.top = `${rect.bottom + window.scrollY}px`;
    dateInputContainer.style.display = "block"; // Mostrar el selector de fecha

    // Manejar selección de fecha
    dateInput.addEventListener("change", function onDateChange(event) {
        const selectedDate = new Date(event.target.value);
        const firstDate = convertirFechaString(datosAcuario[0].Fecha);
        const lastDate = convertirFechaString(datosAcuario[datosAcuario.length - 1].Fecha);

        // Validar que la fecha seleccionada sea un domingo
        if (selectedDate.getDay() !== 0) {
            alert("La fecha seleccionada debe ser un domingo.");
            event.target.value = ""; // Limpiar la fecha seleccionada del selector
            FechaASelector(); //Poner la fecha de la selección en el selector de fechas
            dateInputContainer.style.display = "block";
            return;
        }

        const minDate = new Date(firstDate);
        const maxDate = new Date(lastDate);
        maxDate.setDate(maxDate.getDate() + 1);
        minDate.setDate(minDate.getDate() - 1);

        if (!(selectedDate >= minDate && selectedDate <= maxDate)) {
            alert(
                `La fecha debe estar entre ${firstDate.toLocaleDateString()} y ${lastDate.toLocaleDateString()}.`
            );
            event.target.value = ""; // Limpiar la fecha seleccionada
            FechaASelector(); //Poner la fecha de la selección en el selector de fechas
            dateInputContainer.style.display = "block";
            return;
        }

        dateInputContainer.style.display = "none";

        // Obtener el índice de la fila
        const rowIndex = getRowIndexByDate(selectedDate);
        if (rowIndex !== -1) {
            // selectAndScrollToRow(rowIndex); // Seleccionar y hacer scroll a la fila

            const bloque = document.querySelectorAll(".tabla-cuerpo .fila");
            const filaSelect = bloque[rowIndex];

            if (bloque.length > 0) {
                setTimeout(() => {
                    filaSelect.scrollIntoView({ behavior: "instant", block: "center" }); // Asegura visibilidad
                    seleccionarFila(filaSelect, bloque);
                }, 10); // Retraso mínimo para asegurar que la cuadrícula esté lista
            }

            seleccionarFila(rowIndex, document.querySelectorAll(".tabla-cuerpo .fila"));
            rowIndex.scrollIntoView({ behavior: "instant", block: "center" }); // Asegura visibilidad


            // Ocultar el selector de fecha y limpiar el input
            dateInputContainer.style.display = "none";
            dateInput.value = ""; // Limpiar el valor del input
            dateInput.blur();

            // Quitar el evento para evitar múltiples llamadas
            dateInput.removeEventListener("change", onDateChange);
        }
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

//Funcion para mostrar en el selector de fechas la fecha seleccionada
function FechaASelector() {
    const filasTabla = document.querySelectorAll(".tabla-cuerpo .fila");

    // Convertimos NodeList a Array para usar findIndex
    const indiceSeleccionada = Array.from(filasTabla).findIndex(fila =>
        fila.classList.contains("fila-seleccionada")
    );

    const fechaSeleccionada = convertirFechaString(datosAcuario[indiceSeleccionada].Fecha);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);

    // Verificar si hay una fecha seleccionada
    if (fechaSeleccionada) {
        // Configurar el valor del input de fecha con la fecha seleccionada
        dateInput.valueAsDate = fechaSeleccionada;
    } else {
        // Si no hay una fecha seleccionada, puedes configurar un valor por defecto, por ejemplo, la fecha de hoy
        dateInput.valueAsDate = new Date();
    }

    return fechaSeleccionada;
}

function getRowIndexByDate(selectedDate) {
    for (let i = 0; i < datosAcuario.length; i++) {
        const rowDate = convertirFechaString(datosAcuario[i].Fecha);
        if (rowDate.toDateString() === selectedDate.toDateString()) {
            return i; // Retorna el índice de la fila correspondiente
        }
    }
    return -1; // Si no se encuentra la fecha, retornar -1
}

//******************************************** */
// let datosTarea = [
//     { Fecha: "18 oct. 2020", actividad: "(√)Cambio 1 lt MICROMEC" },
//     { Fecha: "12 sep. 2021", actividad: "(√)Comprar 1 lt MICROMEC" }
// ];

function generarResumenTarea(numeroTarea) {

    // Referencia al modal y su cuerpo
    const modal = document.getElementById("modalTextoCelda");
    const modalTitulo = document.getElementById("modalTextoCeldaLabel");
    const modalCuerpo = document.getElementById("contenidoCeldaModal");

    // Cambiar el título del modal
    modalTitulo.textContent = `RESUMEN TAREA N° ${numeroTarea}`;

    // Crear datosTarea dinámicamente a partir de datosAcuario
    const datosTarea = datosAcuario
        .filter(dato => dato[`tarea${numeroTarea}`]) // Solo tareas válidas
        .map(dato => ({
            Fecha: dato.Fecha,
            actividad: dato[`tarea${numeroTarea}`]
        }));

    // Preparar el contenido con formato adecuado
    let contenido = "<pre style='font-family: monospace; white-space: no-wrap; text-align: left; margin: 0;'>";

    datosTarea.forEach((dato, index) => {
        const fecha = ajustaFecha(dato.Fecha).padEnd(8); // Fecha con espacio uniforme
        // const semanas = index === 0 ? "Inicio".padEnd(8) : calcularDiferenciaSemanas(datosTarea[index - 1].Fecha, dato.Fecha).padEnd(6);
        // Normalizar el formato de semanas
        // Normalizar el formato de semanas
        const semanas = index === 0 ? "Inicio".padEnd(8) : calcularDiferenciaSemanas(datosTarea[index - 1].Fecha, dato.Fecha).replace(" sem.", "sem.").padStart(8); // Quitar espacio en " sem." // Asegurar que el texto ocupe 8 caracteres
        // const actividad = dato.actividad.substring(0, 1) == '§' ? `${dato.actividad.replace("§", "√")}` : dato.actividad;
        let actividad = dato.actividad.startsWith("§") ? `<span style="color: green;">${dato.actividad.slice(1)}</span>` : dato.actividad;

        contenido += `${fecha} | ${semanas} | ${actividad}\n`;
    });

    contenido += "</pre>";

    // Insertar el contenido generado en el cuerpo del modal
    modalCuerpo.innerHTML = contenido;

    // Aplicar altura máxima al modal
    modalCuerpo.style.maxHeight = "80vh";
    modalCuerpo.style.overflowY = "auto";

    // Mostrar el modal
    const modalBootstrap = new bootstrap.Modal(modal);
    modalBootstrap.show();

}

function ajustaFecha(fecha) {
    fecha = fecha.trim().replace(" ", "").replace(". ", "");
    if (fecha.length < 9) fecha = " " + fecha;
    return fecha;
}

// Función para formatear fechas en formato uniforme (Ej: '03 ago. 2024')
function formatearFechaUniforme(fechaString) {
    const opciones = { day: "2-digit", month: "short", year: "numeric" };
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", opciones).replace(".", "");
}

// Función para calcular la diferencia en semanas entre dos fechas
function calcularDiferenciaSemanas(fechaAnterior, fechaActual) {
    const date1 = convertirFechaString(fechaAnterior);
    const date2 = convertirFechaString(fechaActual);

    const diferenciaDias = ((date2 - date1) / (1000 * 60 * 60 * 24)).toFixed(0).toString().length >= 7 ? (date2 - date1) / (1000 * 60 * 60 * 24) : " " + ((date2 - date1) / (1000 * 60 * 60 * 24)).toFixed(0).toString();
    return `${diferenciaDias} sem.`;
}

// Función para truncar texto largo
function truncarTexto(texto, maxLongitud) {
    return texto.length > maxLongitud ? texto.slice(0, maxLongitud - 3) + "." : texto;
}

document.getElementById("resumenTarea_1").addEventListener("click", () => {
    generarResumenTarea(1);
});
document.getElementById("resumenTarea_2").addEventListener("click", () => {
    generarResumenTarea(2);
});