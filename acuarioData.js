// URL base de GitHub para los archivos JSON
const githubBaseUrl = "https://raw.githubusercontent.com/LorenPorti/FECHAS-ACUARIO-WEB/main/"; // Reemplaza con la URL base de tu repositorio

let data = []; // Declarar data globalmente
let dataConfig = {};

// Función para cargar los datos de un acuario específico desde GitHub
function loadAcuarioData(acuarioNumber) {
    let fileName = `acuarioNum${acuarioNumber}.json`;
    let fileUrl = `${githubBaseUrl}${fileName}`; // URL completa para el archivo en GitHub

    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo ${fileName} desde GitHub`);
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData; // Asignar datos a la variable global
            initializeGrid(data); // Llamar a la función para inicializar la tabla
        })
        .catch(error => console.log(`Error al cargar el archivo:`, error));

    // Configuración
    fileName = `acuarioNum${acuarioNumber}Config.json`;
    fileUrl = `${githubBaseUrl}${fileName}`; // URL completa para el archivo en GitHub
    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo ${fileName} desde GitHub`);
            }
            return response.json();
        })
        .then(configData => {
            dataConfig = configData[0]; // Guardar la configuración en la variable global

            // Mostrar el nombre del acuario en la interfaz
            document.getElementById("nombreAcuario").textContent = dataConfig.nombreDelAcuario;
        })
        .catch(error => console.log(`Error al cargar el archivo:`, error));
}

// Variable para almacenar la fila seleccionada
let selectedRow = null;

// Inicializar el SfDataGrid con los datos cargados
function initializeGrid(data) {
    const gridElement = document.getElementById("sfDataGrid");

    // Limpiar el contenido previo
    gridElement.innerHTML = "";

    // // Crear la cabecera de las columnas (sin "Inyección CO2")
    // const headers = ["Fecha", "pH", "KH", "tmpºC", "CO2", "NO3"]; // Sin "inyeccCO2"
    // const headerRow = document.createElement("tr");

    // // Crear las celdas de la cabecera con la clase "header-font"
    // headers.forEach(header => {
    //     const th = document.createElement("th");
    //     th.textContent = header;
    //     th.classList.add("header-font"); // Asegurarse de agregar la clase correctamente
    //     headerRow.appendChild(th);
    // });

    // gridElement.appendChild(headerRow);

    // Crear las filas de los datos
    data.forEach((item) => {
        const dataRow = document.createElement("tr");

        // Fecha
        const dateCell = document.createElement("td");
        dateCell.textContent = item.Fecha;
        dateCell.classList.add("medium-font"); // Aplicar la clase de fuente pequeña
        dataRow.appendChild(dateCell);

        // pH (con un decimal)
        const phCell = document.createElement("td");
        phCell.textContent = item.pH.toFixed(1); // Formatear con un decimal
        phCell.classList.add("medium-font");
        dataRow.appendChild(phCell);

        // KH (con un decimal)
        const khCell = document.createElement("td");
        khCell.textContent = item.KH.toFixed(1);
        khCell.classList.add("medium-font");
        dataRow.appendChild(khCell);

        // Temp
        const tempCell = document.createElement("td");
        tempCell.textContent = item.temp;
        tempCell.classList.add("medium-font");
        dataRow.appendChild(tempCell);

        // CO2 (con dos decimales)
        const co2Cell = document.createElement("td");
        co2Cell.textContent = item.CO2.toFixed(2);
        co2Cell.classList.add("medium-font");
        dataRow.appendChild(co2Cell);

        // NO3
        const no3Cell = document.createElement("td");
        no3Cell.textContent = item.NO3;
        no3Cell.classList.add("medium-font");
        dataRow.appendChild(no3Cell);

        // Crear la columna IyCO2 con el icono correspondiente
        const inyCO2Cell = document.createElement("td");
        inyCO2Cell.classList.add("medium-font");
        inyCO2Cell.innerHTML = agregarIconoIyCO2(item.inyeccCO2); // Asignar el icono según el valor de item.inyeccCO2
        dataRow.appendChild(inyCO2Cell);

        // Añadir la fila a la tabla
        gridElement.appendChild(dataRow);

        // Almacenar la fila seleccionada al hacer clic
        dataRow.addEventListener("click", function() {
            // Desmarcar la fila previamente seleccionada, si existe
            if (selectedRow !== null) {
                selectedRow.classList.remove("selected");
            }
            dataRow.classList.add("selected"); // Marcar la nueva fila como seleccionada
            selectedRow = dataRow; // Actualizar la fila seleccionada

            // Guardar el índice de la fila seleccionada en sessionStorage
            sessionStorage.setItem("selectedRowIndex", dataRow.rowIndex);

            showDetails(data[dataRow.rowIndex]);
        });
    });

    // Pone el ancho de columna con !important

    // Obtener la primera fila de datos en la tabla
    const primeraFila = document.querySelector("#sfDataGrid tr");

    if (!primeraFila) return; // Salir si no hay filas de datos

    // Obtener los elementos de cabecera
    const columnasCabecera = document.querySelectorAll(
        "#tableHeader .header-font"
    );

    // Obtener las celdas de la primera fila de datos
    const columnasDatos = primeraFila.querySelectorAll("td");

    // Ajustar el ancho de cada columna de la cabecera según la primera fila de datos
    columnasCabecera.forEach((columnaCabecera, index) => {
        let anchoCelda = columnasDatos[index].getBoundingClientRect().width;

        // Si es la columna "Fecha", añade 3 píxeles adicionales
        if (columnaCabecera.id === "columnaFecha") { anchoCelda += 3; }

        // Ajustar el ancho de la columna "IyCO2" agregando 2 píxeles o asignando un valor fijo
        if (columnaCabecera.id === "columnaIyCO2") {
            anchoCelda = 50; // Ancho fijo para "IyCO2" para albergar un icono
        }

        // Asignar el ancho con !important
        columnaCabecera.style.setProperty("width", `${anchoCelda}px`, "important");
    });

    // Seleccionar automáticamente la última fila y hacer scroll hasta ella
    const lastRow = gridElement.lastElementChild;
    selectedRow = lastRow;
    if (lastRow) {
        lastRow.classList.add("selected"); // Resalta la última fila
        lastRow.scrollIntoView({ behavior: "auto", block: "center" }); // Hace scroll hasta la última fila
        showDetails(data[data.length - 1]); // Muestra los detalles de la última fila
    }
}

// Función para agregar iconos a la columna "IyCO2"
function agregarIconoIyCO2(inyCO2Value) {
    let iconoImagen = "";

    // Determinar el icono correspondiente según el valor
    switch (inyCO2Value) {
        case 1:
            iconoImagen = "imagenes/CO2 con Levadura.png"; // Ruta del icono para 1
            break;
        case 2:
            iconoImagen = "imagenes/CO2 con Botella Presión.png"; // Ruta del icono para 2
            break;
        case 3:
            iconoImagen = "imagenes/Sin CO2.png"; // Ruta del icono para 3
            break;
        default:
            iconoImagen = "imagenes/default.png"; // Ruta de un icono por defecto si el valor no es 1, 2, o 3
            break;
    }

    return `<img src="${iconoImagen}" alt="CO2 Icon" style="width: 32px; height: 32px;" />`; // Puedes ajustar el tamaño del icono aquí
}

// Función para resaltar la fila seleccionada
/* function highlightRow(selectedRow) {
    // Elimina cualquier resalte previo
    document.querySelectorAll("#sfDataGrid tr").forEach(row => {
        row.classList.remove("selected-row");
    });
    // Añade la clase de resalte a la fila seleccionada
    selectedRow.classList.add("selected-row");
} */

// Función para mostrar detalles de la fila seleccionada
function showDetails(item) {
    // Mostrar los valores del item en la consola (puedes hacer algo más con ellos)
    // console.log("Inyección CO2:", item.inyeccCO2);
    // console.log("Plantas:", item.plantas);
    // console.log("Agua:", item.agua);
    // console.log("Superficie Agua:", item.sup_agua);
    // console.log("Algas:", item.algas);
    // console.log("Comentario:", item.comentario);

    // Obtener el comentario de la fila seleccionada
    const comment = item.comentario;

    // Buscar el cuadro de texto para mostrar el comentario
    const commentBox = document.getElementById("comentarioBox");

    // Cargar el comentario en el cuadro de texto
    commentBox.value = comment; // Esto carga el comentario en el textarea

    // Llamada a la función para actualizar el cuadro de detalles
    mostrarDetallesConEstado(item);
}

function mostrarDetallesConEstado(item) {

    // Plantas (0-1 bien, 2 regular, 3 mal)
    const plantasEstado = item.plantas; // Valor de 'plantas' en el objeto 'item
    const plantasClase = obtenerClaseDeEstado(item.plantas);
    document.getElementById("detallePlantas").classList.add(plantasClase);
    document.getElementById("iconoPlantas").src = (plantasEstado === 0 || plantasEstado === 1) ? 'imagenes/iconoPlantasBien.png' :
        plantasEstado === 2 ? 'imagenes/iconoPlantasRegular.png' :
        'imagenes/iconoPlantasMal.png';
    document.getElementById("checkPlantas").textContent = (plantasEstado === 0 || plantasEstado === 1) ? '✔️' :
        plantasEstado === 2 ? '⛔' : '❌';

    // Agua (0-1 bien, 2 regular, 3 mal)
    const aguaEstado = item.agua;
    const aguaClase = obtenerClaseDeEstado(item.agua);
    document.getElementById("detalleAgua").classList.add(aguaClase);
    document.getElementById("iconoAgua").src = (aguaEstado === 0 || aguaEstado === 1) ? '/imagenes/iconoAguaBien.png' :
        aguaEstado === 2 ? '/imagenes/iconoAguaRegular.png' : '/imagenes/iconoAguaMal.png';
    document.getElementById("checkAgua").textContent = (aguaEstado === 0 || aguaEstado === 1) ? '✔️' :
        aguaEstado === 2 ? '⛔' : '❌';

    // Agua (0-1 bien, 2 regular, 3 mal)
    const sup_aguaEstado = item.sup_agua;
    const sup_aguaClase = obtenerClaseDeEstado(item.sup_agua);
    document.getElementById("detalleSupAgua").classList.add(sup_aguaClase);
    document.getElementById("iconoSupAgua").src = (sup_aguaEstado === 0 || sup_aguaEstado === 1) ? '/imagenes/iconoSupAguaBien.png' :
        sup_aguaEstado === 2 ? '/imagenes/iconoSupAguaRegular.png' : '/imagenes/iconoSupAguaMal.png';
    document.getElementById("checkSupAgua").textContent = (aguaEstado === 0 || aguaEstado === 1) ? '✔️' :
        aguaEstado === 2 ? '⛔' : '❌';

    // Agua (0-1 bien, 2 regular, 3 mal)
    const algasEstado = item.algas;
    const algasClase = obtenerClaseDeEstado(item.algas);
    document.getElementById("detalleAlgas").classList.add(algasClase);
    document.getElementById("iconoAlgas").src = (algasEstado === 0 || algasEstado === 1) ? '/imagenes/iconoAlgasBien.png' :
        algasEstado === 2 ? '/imagenes/iconoAlgasRegular.png' : '/imagenes/iconoAlgasMal.png';
    document.getElementById("checkAlgas").textContent = (algasEstado === 0 || algasEstado === 1) ? '✔️' :
        algasEstado === 2 ? '⛔' : '❌';

    // Iny. CO2 (1 levadura, 2 B. presión, 3 Sin CO2)
    const inyCO2Estado = item.inyeccCO2;
    document.getElementById("detalleInyCO2").classList.add('bien');
    document.getElementById("iconoInyCO2").src = inyCO2Estado === 1 ? 'levadura_icon.png' :
        inyCO2Estado === 2 ? 'botella_presion_icon.png' :
        'sin_co2_icon.png';
}

function obtenerClaseDeEstado(valor) {
    if (valor === 0) {
        return 'estado-bien'; // Verde para "bien"
    } else if (valor === 1 || valor === 2) {
        return 'estado-regular'; // Amarillo para "regular"
    } else if (valor === 3) {
        return 'estado-mal'; // Rojo para "mal"
    }
    return ''; // Clase vacía si no se encuentra el valor
}

// Función para cargar el archivo JSON desde GitHub
function cargarAcuarioSeleccionado() {
    const fileUrl = `${githubBaseUrl}acuarioActual.json`; // URL completa para el archivo en GitHub
    fetch(fileUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON: ' + response.statusText);
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(function(data) {
            console.log("Datos cargados:", data); // Verificar que los datos se cargaron correctamente

            // Obtener el número de acuario del archivo JSON
            const numAcuario = data[0] && data[0].numAcuario ? data[0].numAcuario : "No disponible";

            loadAcuarioData(numAcuario);

            // Mostrar el número de acuario en el elemento HTML
            document.getElementById("acuarioSeleccionado").textContent = numAcuario;
        })
        .catch(function(error) {
            console.log("Error al cargar el acuario:", error);
            document.getElementById("acuarioSeleccionado").textContent = "Error al cargar";
        });
}

document.getElementById("irASeleccion").addEventListener("click", function(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    const gridElement = document.getElementById("sfDataGrid");
    const selectedRowIndex = sessionStorage.getItem("selectedRowIndex");

    if (selectedRowIndex !== null) {
        selectedRow = gridElement.children[selectedRowIndex]; // Recuperar la fila seleccionada
        selectedRow.scrollIntoView({ behavior: "auto", block: "center" });
        selectedRow.classList.add("selected"); // Marcar la fila al hacer scroll
    } else {
        console.log("No hay fila seleccionada.");
    }
});

//************************************************
// Manejar clic en la opción "Ir a la fecha final"
document.getElementById("ir-a-fecha-final").addEventListener("click", function() {
    const gridElement = document.getElementById("sfDataGrid");
    const lastIndex = gridElement.children.length - 1;
    if (lastIndex >= 0) {
        const ultimaFila = gridElement.children[lastIndex];

        // Eliminar la selección de cualquier fila previamente seleccionada
        if (selectedRow !== null) {
            selectedRow.classList.remove("selected");
        }

        // Marcar la última fila como seleccionada
        ultimaFila.classList.add("selected");
        selectedRow = ultimaFila;

        // Guardar el índice de la última fila en sessionStorage
        sessionStorage.setItem("selectedRowIndex", lastIndex);

        // Desplazar a la última fila
        ultimaFila.scrollIntoView({ behavior: "auto", block: "center" });
    }

    // Mostrar detalles de la última fila
    showDetails(data[data.length - 1]);
});

//************************************************
// Manejar clic en la opción "Ir a la fecha inicial"
document.getElementById("ir-a-fecha-inicial").addEventListener("click", function() {
    const gridElement = document.getElementById("sfDataGrid");
    const primeraFila = gridElement.children[0];

    if (primeraFila) {
        // Eliminar la selección de cualquier fila previamente seleccionada
        if (selectedRow !== null) {
            selectedRow.classList.remove("selected");
        }

        // Marcar la primera fila como seleccionada
        primeraFila.classList.add("selected");
        selectedRow = primeraFila;

        // Guardar el índice de la primera fila en sessionStorage
        sessionStorage.setItem("selectedRowIndex", 0);

        // Desplazar a la primera fila
        primeraFila.scrollIntoView({ behavior: "auto", block: "start" });
    }

    // Mostrar detalles de la primera fila
    showDetails(data[0]);
});

//************************************************
//Función para Ir a Fecha
document.getElementById("ir-a-fecha").addEventListener("click", function(event) {
    event.preventDefault();

    const dateInputContainer = document.getElementById("dateInputContainer");
    const dateInput = document.getElementById("dateInput");

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
        const firstDate = parseToDate(data[0].Fecha);
        const lastDate = parseToDate(data[data.length - 1].Fecha);

        // Validar que la fecha seleccionada sea un domingo
        if (selectedDate.getDay() !== 0) {
            alert("La fecha seleccionada debe ser un domingo.");
            event.target.value = ""; // Limpiar la fecha seleccionada
            return;
        }

        const minDate = new Date(firstDate);
        const maxDate = new Date(lastDate);
        maxDate.setDate(maxDate.getDate() + 1);
        minDate.setDate(minDate.getDate() - 1);

        if (!(selectedDate >= minDate && selectedDate <= maxDate)) {
            alert(`La fecha debe estar entre ${firstDate.toLocaleDateString()} y ${lastDate.toLocaleDateString()}.`);
            event.target.value = ""; // Limpiar la fecha seleccionada
            return;
        }

        // Obtener el índice de la fila
        const rowIndex = getRowIndexByDate(selectedDate);
        if (rowIndex !== -1) {
            selectAndScrollToRow(rowIndex); // Seleccionar y hacer scroll a la fila

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
            dateInputContainer.style.display = "none";
            document.removeEventListener("click", ocultarSelectorFecha);
        }
    }

    // Asegurarse de que el evento de clic se registre después de mostrar el selector
    setTimeout(() => {
        document.addEventListener("click", ocultarSelectorFecha);
    }, 0);
});

// Función para obtener el índice de la fila correspondiente a la fecha seleccionada
function getRowIndexByDate(selectedDate) {
    for (let i = 0; i < data.length; i++) {
        const rowDate = parseToDate(data[i].Fecha);
        if (rowDate.toDateString() === selectedDate.toDateString()) {
            return i; // Retorna el índice de la fila correspondiente
        }
    }
    return -1; // Si no se encuentra la fecha, retornar -1
}

// Función para seleccionar y hacer scroll a la fila correspondiente
function selectAndScrollToRow(rowIndex) {
    const gridElement = document.getElementById("sfDataGrid");
    const row = gridElement.children[rowIndex];

    if (row) {
        // Marcar la fila como seleccionada
        if (selectedRow !== null) {
            selectedRow.classList.remove("selected");
        }
        row.classList.add("selected");
        selectedRow = row;

        // Guardar el índice de la fila seleccionada
        sessionStorage.setItem("selectedRowIndex", rowIndex);

        // Desplazar la fila al centro de la vista
        row.scrollIntoView({ behavior: "auto", block: "center" });

        // Mostrar detalles de la fila seleccionada
        showDetails(data[rowIndex]);
    }
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