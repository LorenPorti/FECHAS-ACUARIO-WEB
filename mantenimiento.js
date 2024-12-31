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

    let mensajeGeneral = `<strong style="padding-left: 2px;">Próximas tareas:</strong><br>`;

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