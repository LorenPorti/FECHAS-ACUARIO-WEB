// URL base de GitHub para los archivos JSON
const githubBaseUrl = "https://raw.githubusercontent.com/LorenPorti/FECHAS-ACUARIO-WEB/main/"; // Reemplaza con la URL base de tu repositorio

let numAcuario; // Número del acuario actual
let datosAcuario = []; // Datos semanales del acuario seleccionado
let dataConfig = {}; // Configuración del acuario seleccionado

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

            // Guardamos los datos del acuario (data) en localStorage
            localStorage.setItem("datosAcuario", JSON.stringify(data));
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
            // Guardamos la configuración en localStorage
            localStorage.setItem("dataConfig", JSON.stringify(configData[0])); // Guardar 'dataConfig' en localStorage
            // Guardamos úmero acuario en localStorage
            localStorage.setItem('numAcuario', numAcuario); // Guardar 'dataConfig' en localStorage

            dataConfig = configData[0]; // Guardar la configuración en la variable global

            // Mostrar el nombre del acuario en la interfaz
            const tituloAcuario = document.getElementById("nombreAcuario");
            if (dataConfig.nombreDelAcuario.length >= 23) //Ajusta el tamaño de letra para que encaje en el cuadro
            {
                tituloAcuario.style.fontSize = "125%";
            } else {
                tituloAcuario.style.fontSize = "145%";
            }
            tituloAcuario.textContent =
                dataConfig.nombreDelAcuario;
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
        phCell.textContent = item.pH.toFixed(1).replace(".", ","); // Formatear con un decimal
        phCell.classList.add("medium-font");
        dataRow.appendChild(phCell);

        // KH (con un decimal)
        const khCell = document.createElement("td");
        khCell.textContent = item.KH.toFixed(1).replace(".", ",");
        khCell.classList.add("medium-font");
        dataRow.appendChild(khCell);

        // Temp
        const tempCell = document.createElement("td");
        tempCell.textContent = item.temp;
        tempCell.classList.add("medium-font");
        dataRow.appendChild(tempCell);

        // CO2 (con dos decimales)
        const co2Cell = document.createElement("td");
        co2Cell.textContent = item.CO2.toFixed(2).replace(".", ",");
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

// Función para mostrar detalles de la fila seleccionada
function showDetails(item) {
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
    // const inyCO2Estado = item.inyeccCO2;
    // document.getElementById("detalleInyCO2").classList.add('bien');
    // document.getElementById("iconoInyCO2").src = inyCO2Estado === 1 ? 'levadura_icon.png' :
    //     inyCO2Estado === 2 ? 'botella_presion_icon.png' :
    //     'sin_co2_icon.png';
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
    // Comprobar si numAcuario ya está almacenado en localStorage
    if (localStorage.getItem('numAcuario')) {
        // Si existe, lo usamos directamente
        numAcuario = localStorage.getItem('numAcuario');
        loadAcuarioData(numAcuario); // Cargar los datos del acuario usando el número guardado en localStorage

        // Actualizar el elemento HTML con el número de acuario
        // document.getElementById("acuarioSeleccionado").textContent = numAcuario;
        // console.log("Cargado desde localStorage:", numAcuario);

    } else {
        // Si no está en localStorage, cargar desde el archivo JSON en GitHub
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
                numAcuario = data[0] && data[0].numAcuario ? data[0].numAcuario : "No disponible";

                // Guardar el número de acuario en localStorage
                localStorage.setItem('numAcuario', numAcuario);

                loadAcuarioData(numAcuario); // Cargar los datos del acuario usando el número obtenido

                // Mostrar el número de acuario en el elemento HTML
                // document.getElementById("acuarioSeleccionado").textContent = numAcuario;
            })
            .catch(function(error) {
                console.log("Error al cargar el acuario:", error);
                // document.getElementById("acuarioSeleccionado").textContent = "Error al cargar";
            });
    }
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

    FechaASelector(); //Poner la fecha de la selección en el selector de fechas

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
    const fechaSeleccionada = parseToDate(data[selectedRow.rowIndex].Fecha);
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

//*************************************************
function mostrarModalGestionAcuarios() {
    // Verifica si ya hay datos en LocalStorage
    let acuarios = JSON.parse(localStorage.getItem('acuarios'));

    if (!acuarios) {
        // Cargar datos desde acuarios.json si no están en LocalStorage
        fetch(githubBaseUrl + 'acuarios.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('acuarios', JSON.stringify(data)); // Guardar en LocalStorage
                mostrarListaAcuarios(data); // Mostrar la lista en el modal
            })
            .catch(error => console.log('Error al cargar acuarios:', error));
    } else {
        // Usar los datos de LocalStorage
        mostrarListaAcuarios(acuarios);
    }

    // Abre el modal de gestión de acuarios
    const modal = new bootstrap.Modal(document.getElementById('gestionAcuariosModal'));
    modal.show();

    // Al cerrar el modal, cargar el acuario seleccionado
    document.getElementById('gestionAcuariosModal').addEventListener('hidden.bs.modal', () => {
        const numAcuario = localStorage.getItem('numAcuario');
        if (numAcuario) {
            cargarAcuarioSeleccionado(); //Funcion que se llama cuando se cierra el mModal de acuarios
        }
    }, { once: true });
}

function mostrarListaAcuarios(acuarios) {
    const listaAcuarios = document.getElementById('listaAcuarios');
    listaAcuarios.innerHTML = ''; // Limpiar lista antes de agregar acuarios

    acuarios.forEach(acuario => {
        const item = document.createElement('li');
        if (acuario.Nombre === dataConfig.nombreDelAcuario) {
            item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'text-bg-success');
        } else item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = `(${acuario.Num}) ${acuario.Nombre} (${acuario.Fecha})`;

        const seleccionarBtn = document.createElement('button');
        seleccionarBtn.classList.add('btn', 'btn-primary', 'btn-sm');
        seleccionarBtn.textContent = 'Seleccionar';
        seleccionarBtn.onclick = () => resaltarAcuarioSeleccionado(acuario.Num);

        item.appendChild(seleccionarBtn);
        listaAcuarios.appendChild(item);
    });
}

// function seleccionarAcuario(numAcuario) {
//     // Actualiza el LocalStorage con el nuevo acuario seleccionado
//     localStorage.setItem('numAcuario', numAcuario);

//     // Recargar los datos del acuario seleccionado
//     loadAcuarioData(numAcuario);

//     // Cierra el modal
//     const modal = bootstrap.Modal.getInstance(document.getElementById('gestionAcuariosModal'));
//     modal.hide();

//     // Mensaje de confirmación (opcional)
//     alert(`Acuario ${numAcuario} seleccionado correctamente.`);
// }

// Función para resaltar el acuario seleccionado
function resaltarAcuarioSeleccionado(numAcuario) {
    // Actualizar el valor de numAcuario en localStorage
    localStorage.setItem('numAcuario', numAcuario);

    // Actualizar el estilo de los acuarios en la lista
    const listaItems = document.querySelectorAll('#listaAcuarios .list-group-item');
    listaItems.forEach(item => item.classList.remove('text-bg-success'));

    // Resaltar el acuario recién seleccionado
    const seleccionado = [...listaItems].find(item => item.textContent.includes(`(${numAcuario})`));
    if (seleccionado) {
        seleccionado.classList.add('text-bg-success');
    }
}

// *******Para cálculo del CO2 ****************
function modificarValor(id, cambio) {
    let input = document.getElementById(id);
    let valor = parseFloat(input.value);
    valor = Math.max(0, (valor + cambio).toFixed(1)); // Evita valores negativos
    input.value = valor;
    calcularCO2(); // Calcula automáticamente al cambiar el valor
}

function calcularCO2() {
    let ph = parseFloat(document.getElementById('ph').value);
    let kh = parseFloat(document.getElementById('kh').value);

    if (isNaN(ph) || isNaN(kh) || ph <= 0 || kh <= 0) {
        document.getElementById('resultado').innerText = "Valor inválido";
        return;
    }

    // Fórmula aproximada: CO2 = 3 * KH * 10^(7 - pH)
    let co2 = (3 * kh * Math.pow(10, 7 - ph)).toFixed(2);
    document.getElementById("resultado").innerText = `${co2}`;
}

// Función para calcular agua de distinta dureza
function calcularMezcla() {
    const volumenTotal = parseFloat(document.getElementById('volumenTotal').value.replace(",", "."));
    const durezaMezcla = parseFloat(document.getElementById('durezaMezcla').value.replace(",", "."));
    const durezaRed = parseFloat(document.getElementById('durezaRed').value.replace(",", "."));
    const durezaOsmosis = parseFloat(document.getElementById('durezaOsmosis').value.replace(",", "."));

    // Evitar divisiones por cero y entradas inválidas
    if (
        isNaN(volumenTotal) || isNaN(durezaMezcla) || isNaN(durezaRed) || isNaN(durezaOsmosis) ||
        (durezaRed === durezaOsmosis)
    ) {
        document.getElementById('resultadoRed').textContent = "–";
        document.getElementById('resultadoOsmosis').textContent = "–";
        return;
    }

    const volumenRed = volumenTotal * (durezaMezcla - durezaOsmosis) / (durezaRed - durezaOsmosis);
    const volumenOsmosis = volumenTotal - volumenRed;

    // Si el cálculo diera valores imposibles (negativos o infinitos), ocultar
    if (!isFinite(volumenRed) || !isFinite(volumenOsmosis) || volumenRed < 0 || volumenOsmosis < 0) {
        document.getElementById('resultadoRed').textContent = "–";
        document.getElementById('resultadoOsmosis').textContent = "–";
        return;
    }

    // Mostrar con un decimal y separador ","
    document.getElementById('resultadoRed').textContent = volumenRed.toFixed(1).replace(".", ",");
    document.getElementById('resultadoOsmosis').textContent = volumenOsmosis.toFixed(1).replace(".", ",");
}



// Detectar cuándo se abre el modal y calcular el resultado inicial
document.getElementById('modalCO2').addEventListener('shown.bs.modal', function() {
    modificarValor('ph', 0); // No cambia el valor, solo fuerza el cálculo inicial
    modificarValor('kh', 0);

    //Valores inicialeas
    document.getElementById('ph').value = dataConfig.pHOpt;
    document.getElementById('kh').value = dataConfig.KHOpt;
});