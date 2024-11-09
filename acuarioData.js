// URL base de GitHub para los archivos JSON
const githubBaseUrl = "https://raw.githubusercontent.com/LorenPorti/FECHAS-ACUARIO-WEB/main/"; // Reemplaza con la URL base de tu repositorio

// Función para cargar los datos de un acuario específico desde GitHub
function loadAcuarioData(acuarioNumber) {
    const fileName = `acuarioNum${acuarioNumber}.json`;
    const fileUrl = `${githubBaseUrl}${fileName}`; // URL completa para el archivo en GitHub

    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo ${fileName} desde GitHub`);
            }
            return response.json();
        })
        .then(data => initializeGrid(data))
        .catch(error => console.error(`Error al cargar el archivo:`, error));
}

// Variable para almacenar la fila seleccionada
let selectedRow = null;

// Inicializar el SfDataGrid con los datos cargados
function initializeGrid(data) {
    const gridElement = document.getElementById("sfDataGrid");

    // Limpiar el contenido previo
    gridElement.innerHTML = '';

    // Crear la cabecera de las columnas (sin "Inyección CO2")
    const headers = ["Fecha", "pH", "KH", "tmpºC", "CO2", "NO3"]; // Sin "inyeccCO2"
    const headerRow = document.createElement("tr");

    // Crear las celdas de la cabecera con la clase "header-font"
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.classList.add("header-font"); // Asegurarse de agregar la clase correctamente
        headerRow.appendChild(th);
    });

    gridElement.appendChild(headerRow);

    // Crear las filas de los datos
    data.forEach(item => {
        const dataRow = document.createElement("tr");

        // Fecha
        const dateCell = document.createElement("td");
        dateCell.textContent = item.Fecha;
        dateCell.classList.add("small-font"); // Aplicar la clase de fuente pequeña
        dataRow.appendChild(dateCell);

        // pH (con un decimal)
        const phCell = document.createElement("td");
        phCell.textContent = item.pH.toFixed(1); // Formatear con un decimal
        phCell.classList.add("small-font");
        dataRow.appendChild(phCell);

        // KH (con un decimal)
        const khCell = document.createElement("td");
        khCell.textContent = item.KH.toFixed(1);
        khCell.classList.add("small-font");
        dataRow.appendChild(khCell);

        // Temp
        const tempCell = document.createElement("td");
        tempCell.textContent = item.temp;
        tempCell.classList.add("small-font");
        dataRow.appendChild(tempCell);

        // CO2 (con dos decimales)
        const co2Cell = document.createElement("td");
        co2Cell.textContent = item.CO2.toFixed(2);
        co2Cell.classList.add("small-font");
        dataRow.appendChild(co2Cell);

        // NO3
        const no3Cell = document.createElement("td");
        no3Cell.textContent = item.NO3;
        no3Cell.classList.add("small-font");
        dataRow.appendChild(no3Cell);

        // Añadir la fila a la tabla
        gridElement.appendChild(dataRow);

        // Añadir un evento de click a la fila para seleccionarla
        dataRow.addEventListener("click", function() {
            // Eliminar la selección de cualquier fila previamente seleccionada
            const selectedRow = gridElement.querySelector(".selected");
            if (selectedRow) {
                selectedRow.classList.remove("selected");
            }

            // Marcar la fila seleccionada
            dataRow.classList.add("selected");

            // Mostrar detalles al hacer clic en la fila
            showDetails(item); // Llamar a la función que muestra los detalles
        });
    });
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
    console.log("Inyección CO2:", item.inyeccCO2);
    console.log("Plantas:", item.plantas);
    console.log("Agua:", item.agua);
    console.log("Superficie Agua:", item.sup_agua);
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
    document.getElementById("iconoPlantas").src = (plantasEstado === 0 || plantasEstado === 1) ? '/imagenes/iconoPlantasBien.png' :
        plantasEstado === 2 ? '/imagenes/iconoPlantasRegular.png' :
        '/imagenes/iconoPlantasMal.png';
    document.getElementById("checkPlantas").textContent = (plantasEstado === 0 || plantasEstado === 1) ? '👍' :
        plantasEstado === 2 ? '✋' : '👎';

    // Agua (0-1 bien, 2 regular, 3 mal)
    const aguaEstado = item.agua;
    const aguaClase = obtenerClaseDeEstado(item.agua);
    document.getElementById("detalleAgua").classList.add(aguaClase);
    document.getElementById("iconoAgua").src = (plantasEstado === 0 || plantasEstado === 1) ? '/imagenes/iconoAguaBien.png' :
        plantasEstado === 2 ? '/imagenes/iconoAguaRegular.png' : '/imagenes/iconoAguaMal.png';
    document.getElementById("checkAgua").textContent = (aguaEstado === 0 || aguaEstado === 1) ? '👍' :
        aguaEstado === 2 ? '✋' : '👎';

    // Agua (0-1 bien, 2 regular, 3 mal)
    const sup_aguaEstado = item.sup_agua;
    const sup_aguaClase = obtenerClaseDeEstado(item.sup_agua);
    document.getElementById("detalleSupAgua").classList.add(sup_aguaClase);
    document.getElementById("iconoSupAgua").src = (sup_aguaEstado === 0 || sup_aguaEstado === 1) ? '/imagenes/iconoSupAguaBien.png' :
        sup_aguaEstado === 2 ? '/imagenes/iconoSupAguaRegular.png' : '/imagenes/iconoSupAguaMal.png';
    document.getElementById("checkSupAgua").textContent = (aguaEstado === 0 || aguaEstado === 1) ? '👍' :
        aguaEstado === 2 ? '✋' : '👎';

    // Algas (0 bien, 1-2 regular, 3 mal)
    const algasEstado = item.algas;
    const algasClase = obtenerClaseDeEstado(algasEstado, 0, 2, 3);
    document.getElementById("detalleAlgas").classList.add(algasClase);
    document.getElementById("iconoAlgas").src = algasEstado === 0 ? 'icono_bien.png' :
        algasEstado <= 2 ? 'icono_regular.png' :
        'icono_mal.png';

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