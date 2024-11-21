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

    // Llamar a la función de selección de combinación
    seleccionarCombinacion(plantas, algas);
}

// Función para manejar la selección de una combinación en la tabla
function seleccionarCombinacion(plantas, algas) {
    const dropdown = document.getElementById('dropdown-fechas');
    const cabecera = document.getElementById('cabecera-combinaciones');
    dropdown.innerHTML = ''; // Limpiar el dropdown antes de llenarlo

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

    console.log("Dropdown actualizado con datos:", combinacionesFiltradas);
}


// Función para obtener las fechas para una combinación específica
function obtenerFechas(plantas, algas) {
    // Filtrar los datos según las plantas y algas y extraer las fechas
    return datosAcuario
        .filter(dato => dato.plantas === plantas && dato.algas === algas)
        .map(dato => dato.fecha); // Suponiendo que cada objeto en datosAcuario tiene una propiedad "fecha"
}

// Función para obtener el estado de las plantas o algas
function getEstado(tipo, valor) {
    if (tipo === 'plantas') {
        const estadosPlantas = ['Excelente', 'Normal', 'Regular', 'Mal'];
        return estadosPlantas[valor] || '';
    } else if (tipo === 'algas') {
        const estadosAlgas = ['Ninguna', 'Presencia', 'Cubierto', 'Muy cubierto'];
        return estadosAlgas[valor] || '';
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
    optionDefault.textContent = 'Selecciona Nudo';
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