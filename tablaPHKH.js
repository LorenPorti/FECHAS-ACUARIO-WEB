import { mostrarAlerta } from "./misFunciones.js";

// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));
const params = new URLSearchParams(window.location.search);
const opcion = params.get("opcion"); // Lee el parámetro 'opcion'
const numeroAcuario = localStorage.getItem("numAcuario");
// URL base de GitHub para los archivos JSON
const githubBaseUrl = "https://raw.githubusercontent.com/LorenPorti/FECHAS-ACUARIO-WEB/main/";

// Construir el nombre del archivo JSON
const archivoAnalisis = `${githubBaseUrl}analisis${numeroAcuario}.json`;

// Insertar el título del acuario en la cabecera
document.getElementById("tituloAcuario").textContent =
    dataConfig.nombreDelAcuario;

// Referencia al modal y su cuerpo
const modal = document.getElementById("modalPhKh");

//Muestra modal
document.addEventListener("DOMContentLoaded", () => {
    const modalBootstrap = new bootstrap.Modal(modal);
    const modalTitulo = document.getElementById("modalPhKhLabel");
    const botonRepetir = document.getElementById("boton-otra-cosa");
    const selectFecha = document.getElementById("selectFecha");
    const tabla = document.getElementById("tablaPhKh");
    const tablaHead = tabla.querySelector("thead tr");
    const tablaBody = tabla.querySelector("tbody");

    if (!selectFecha || !tabla || !tablaHead || !tablaBody) {
        console.error("Algunos elementos del DOM no fueron encontrados.");
        return;
    }

    switch (opcion) {
        case "tabla":
            modalTitulo.textContent = "Tabla PH/KH";
            botonRepetir.textContent = "Volver a mostrar tabla PH/KH";

            // **🔹 Definir límites de pH y KH**
            const phMin = 5.5,
                phMax = 7.5,
                phStep = 0.1;
            const khMin = 0,
                khMax = 10,
                khStep = 0.5;

            // **🔹 Limpiar tabla**
            tablaHead.innerHTML = "<th>KH/pH</th>"; // Primera celda vacía
            tablaBody.innerHTML = "";

            // **🔹 Agregar encabezados de pH**
            for (let ph = phMin; ph <= phMax; ph += phStep) {
                let th = document.createElement("th");
                th.textContent = ph.toFixed(1).toString().replace(".", ",");
                tablaHead.appendChild(th);
            }

            // **🔹 Generar filas de KH y datos de CO2**
            for (let kh = khMin; kh <= khMax; kh += khStep) {
                let row = document.createElement("tr");

                // **Celda de KH**
                let khValue = kh === 0 ? 0.1 : kh; // Si KH = 0, usar 0.1 en el cálculo
                let khCell = document.createElement("td");
                khCell.innerHTML = `<p style="height: 4px; font-weight: bold; color: white; margin-top: 4px;">${khValue
          .toFixed(1)
          .toString()
          .replace(".", ",")}</p>`;
                khCell.style.background = "#659287";
                row.appendChild(khCell);

                // **Celdas de CO2**
                for (let ph = phMin; ph <= phMax; ph += phStep) {
                    let co2 = 3 * khValue * Math.pow(10, 7 - ph);
                    let color = co2 >= 9 && co2 <= 40 ? "#b3e6b3" : "#f5c6c6";
                    let cell = document.createElement("td");
                    cell.style.background = color;
                    cell.textContent = co2.toFixed(1).toString().replace(".", ",");
                    row.appendChild(cell);
                }
                tablaBody.appendChild(row);
            }

            // **🔹 Llenar Dropdown de Fechas**
            selectFecha.innerHTML = ""; // Limpiar opciones previas
            if (Array.isArray(datosAcuario) && datosAcuario.length > 0) {
                datosAcuario.forEach((dato, index) => {
                    if (dato.Fecha && dato.Fecha.trim() !== "") {
                        // Evitar valores vacíos
                        let option = document.createElement("option");
                        option.value = index;
                        option.textContent = dato.Fecha;
                        option.classList.add("roboto-bold-italic");
                        option.style.color = "#606a60";
                        selectFecha.appendChild(option);
                    }
                });

                // **Seleccionar la última fecha por defecto y resaltar la tabla**
                selectFecha.selectedIndex = selectFecha.options.length - 1;
            }

            // **🔹 Asegurar desplazamiento correcto al cargar**
            setTimeout(() => {
                resaltarFechaSeleccionada(selectFecha.value);
            }, 200);

            // **🔹 Evento para cambiar la selección de la fecha**
            selectFecha.addEventListener("change", () => {
                resaltarFechaSeleccionada(selectFecha.value);
            });

            // **🔹 Mostrar modal al hacer clic en 'Volver a mostrar...'**
            botonRepetir.addEventListener("click", () => {
                modalBootstrap.show();
            });

            modalBootstrap.show();
            break;

        case "analisis":
            modalTitulo.textContent = "Análisis Agua Red";
            botonRepetir.textContent = "Volver a mostrar Análisis Agua Red";
            document.getElementById("iconoBuscar").src = "./imagenes/analisis.png";
            cargarAnalisis();
            presentarModalAnalisis();

            const modal = document.getElementById("modalAnalisis");
            const modalAnalisis = new bootstrap.Modal(modal);

            // **🔹 Reutilizar el modal al hacer clic en 'Volver a mostrar...'**
            botonRepetir.addEventListener("click", () => {
                presentarModalAnalisis();
            });
            break;
    }
});

// Función para cargar el archivo JSON de análisis sin async/await
async function cargarAnalisis() {
    try {
        const response = await fetch(archivoAnalisis);
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }
        const datosAnalisis = await response.json();
        // console.log("Datos de análisis cargados:", datosAnalisis);
        return datosAnalisis; // Retorna el nombre de la empresa
    } catch (error) {
        console.error("Error al cargar los datos del análisis:", error);
        return null;
    }
}

let modalAnalisis; // Definir la variable fuera de la función
async function presentarModalAnalisis() {
    const datos = await cargarAnalisis();
    const modal = document.getElementById("modalAnalisis");

    // Solo inicializar el modal una vez
    if (!modalAnalisis) {
        modalAnalisis = new bootstrap.Modal(modal);
    }

    const modalTitulo = document.getElementById("modalTitulo");
    const modalCuerpo = document.getElementById("modalCuerpo");
    let contenido = `
    <div>
        <h5 class="empresa georgia-medium"> Empresa: ${datos.Empresa.Empresa}</h5>
        <hr style="margin-top: 0;">
    </div>`;

    for (let i = 0; i < datos.Analisis.length; i++) {
        contenido += `        
        <div class="d-flex flex-row">
            <div class="elemento georgia-medium-italic">${datos.Analisis[i].NombreElemento}</div>
            <div class="valor roboto-medium">${datos.Analisis[i].ValorElemento}</div>
            <div class="unidad georgia-medium">${datos.Analisis[i].UnidadElemento}</div>
        </div>
    `;
    }

    modalCuerpo.innerHTML = contenido;

    modalTitulo.textContent = "Análisis Agua Red de Suministro Agua Potable";

    modalAnalisis.show();
}

// 🔹 Función para resaltar la celda del CO₂ según el índice seleccionado
function resaltarFechaSeleccionada(indice) {
    let datosSeleccionados = datosAcuario[indice];
    let phSeleccionado = parseFloat(datosSeleccionados.pH);
    let khSeleccionado = parseFloat(datosSeleccionados.KH);
    let fecha = datosAcuario[indice].Fecha;

    if (!verificarLimites(phSeleccionado, khSeleccionado, fecha)) {
        selectFecha.value = indice;
        datosSeleccionados = datosAcuario[indice];
        if (phSeleccionado < 5.5) phSeleccionado = 5.5;
        if (phSeleccionado > 7.5) phSeleccionado = 7.5;
    }

    // Redondeo del khSeleccionado a múltiplos de 0.5, excepto si es menor que 0.5 (se ajusta a 0.1)
    if (khSeleccionado < 0.5) {
        khSeleccionado = 0.1;
    } else {
        khSeleccionado = Math.round(khSeleccionado * 2) / 2;
    }

    // 1️⃣ Quitar resaltados previos
    document.querySelectorAll("#tablaPhKh th, #tablaPhKh td").forEach((cell) => {
        cell.style.border = ""; // Eliminar borde de celdas
        cell.style.color = ""; // Restaurar color del texto
        cell.style.fontWeight = "";
    });

    // 1️⃣ Restablecer todos los estilos previos
    document.querySelectorAll("#tablaPhKh th, #tablaPhKh td").forEach((cell) => {
        cell.style.border = "";
        cell.style.color = "";
        cell.style.fontSize = "";
        cell.style.fontWeight = "";
    });
    document.querySelectorAll("#tablaPhKh td p").forEach((cell) => {
        cell.style.color = "white";
        cell.style.fontWeight = "bold";
        cell.style.fontSize = "12px";
    });

    // 2️⃣ Buscar la celda de KH en la primera columna
    let filas = document.querySelectorAll("#tablaPhKh tbody tr");
    let filaKH = Array.from(filas).find((row) => {
        let valorKH = parseFloat(row.cells[0].textContent.replace(",", "."));
        return valorKH === khSeleccionado;
    });

    // 3️⃣ Buscar la celda de PH en la primera fila
    let encabezados = document.querySelectorAll("#tablaPhKh thead th");
    let columnaPH = Array.from(encabezados).findIndex((th) => {
        let valorPH = parseFloat(th.textContent.replace(",", "."));
        return valorPH === phSeleccionado;
    });

    // 4️⃣ Si se encuentra el cruce, resaltar celda, PH y KH
    if (filaKH && columnaPH !== -1) {
        let celdaCO2 = filaKH.cells[columnaPH];

        // Resaltar celda CO2
        celdaCO2.style.border = "6px solid maroon";

        // Agregar clase
        celdaCO2.classList.add("celda-resaltada");

        // Agregar atributo data-index (reemplaza 'n' por el valor deseado)
        celdaCO2.setAttribute("data-index", indice);

        // 🔹 Resaltar KH en maroon y negrita
        // 🔹 Resaltar KH dentro del <p>
        let celdaKH = filaKH.cells[0].querySelector("p");
        if (celdaKH) {
            celdaKH.style.setProperty("color", "maroon", "important");
            celdaKH.style.setProperty("font-size", "15px", "important");
            celdaKH.style.setProperty("font-weight", "bold", "important");
        }

        // 🔹 Resaltar PH en maroon y negrita
        let celdaPH = encabezados[columnaPH];
        celdaPH.style.setProperty("color", "maroon", "important");
        celdaPH.style.setProperty("font-size", "15px", "important");
        celdaPH.style.setProperty("font-weight", "bold", "important");

        // 📌 5️⃣ **Desplazar tabla para mostrar la celda resaltada**
        let tabla = document.getElementById("contenedorTabla"); // Asegúrate de que el div contenedor tiene `overflow: auto`
        if (tabla) {
            let offsetX =
                celdaCO2.offsetLeft - tabla.clientWidth / 2 + celdaCO2.clientWidth / 2;
            let offsetY =
                celdaCO2.offsetTop - tabla.clientHeight / 2 + celdaCO2.clientHeight / 2;
            tabla.scrollTo({ left: offsetX, top: offsetY, behavior: "smooth" });
        }
    }
}

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

function verificarLimites(pH, KH, fecha) {
    let minPH = 5.5; // Ajustar según la escala de la tabla
    let maxPH = 7.5;
    let minKH = 0.1;
    let maxKH = 10;
    let estado = true;

    if (pH < minPH || pH > maxPH) {
        setTimeout(() => {
            mostrarAlerta(
                1,
                `¡Advertencia!<br> ${fecha}<br>`,
                `El pH (${pH}) está fuera de los límites (${minPH}-${maxPH}).<br>La tabla tomará el valor del límite.`
            );
        }, 200);
        return false;
    }

    if (KH < minKH || KH > maxKH) {
        setTimeout(() => {
            mostrarAlerta(
                1,
                `¡Advertencia!<br> ${fecha}<br>`,
                `El KH (${KH}) está fuera de los límites (${minKH}-${maxKH}).<br>La tabla tomará el valor del límite.`
            );
        }, 200);
        return false;
    }
    return estado;
}

//***************IR A FECHA INICIO/FINAL*****************
document.getElementById('irFechaInicio').addEventListener('click', () => {
    irAFecha('inicio');
});
document.getElementById('irFechaFinal').addEventListener('click', () => {
    irAFecha('final');
});

function irAFecha(tipo) {
    let fecha;
    const selector = document.getElementById('selectFecha');

    if (tipo === "inicio") {
        selectFecha.selectedIndex = 0;
        resaltarFechaSeleccionada(0);
    } else if (tipo === "final") {
        selector.selectedIndex = datosAcuario.length - 1;
        resaltarFechaSeleccionada(datosAcuario.length - 1);
    }

}

//***************IR A UNA FECHA*****************
document.getElementById("irFecha").addEventListener("click", function(event) {
    event.preventDefault();

    const dateInput = document.getElementById("dateInput");

    FechaASelector();

    // Alternar la visibilidad del input
    if (dateInput.style.display === "none" || dateInput.style.display === "") {
        dateInput.style.display = "block";
        dateInput.focus(); // Para que se abra el selector de fecha
    } else {
        dateInput.style.display = "none";
    }

    dateInput.addEventListener("change", function onDateChange(event) {
        let fechaSeleccionada = this.value;

        const selectedDate = new Date(event.target.value);
        const firstDate = parseToDate(datosAcuario[0].Fecha);
        const lastDate = parseToDate(datosAcuario[datosAcuario.length - 1].Fecha);

        // Validar que la fecha seleccionada sea un domingo
        if (selectedDate.getDay() !== 0) {
            mostrarAlerta(0, "¡ATENCION!<br>", "La fecha seleccionada debe ser un domingo.");
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
            mostrarAlerta(0, "¡ATENCION!<br>", `La fecha debe estar entre ${firstDate.toLocaleDateString()} y ${lastDate.toLocaleDateString()}.`);
            event.target.value = ""; // Limpiar la fecha seleccionada
            FechaASelector(); //Poner la fecha de la selección en el selector de fechas
            dateInputContainer.style.display = "block";
            return;
        }

        if (fechaSeleccionada) {
            let fechaFormateada = formatearFecha(fechaSeleccionada).replace(/\bsept\b/, "sep");
            let selectFecha = document.getElementById("selectFecha");

            // Buscar si la fecha ya existe en las opciones
            let opciones = selectFecha.options;
            let encontrada = false;

            for (let i = 0; i < opciones.length; i++) {
                if (opciones[i].text === fechaFormateada) {
                    selectFecha.selectedIndex = i; // Selecciona la opción existente
                    encontrada = true;
                    resaltarFechaSeleccionada(i);
                    break;
                }
            }

            // Si no está en la lista, no se cambia nada
            if (!encontrada) {
                console.warn("Fecha no encontrada en el dropdown.");
            }

            // Ocultar el input después de seleccionar la fecha
            this.style.display = "none";
        }
    });

    // Manejar clic fuera del selector para ocultarlo
    function ocultarSelectorFecha(evento) {
        if (!dateInput.contains(evento.target) && evento.target !== dateInput) {
            document.removeEventListener("click", ocultarSelectorFecha);
            dateInput.style.display = "none";
        }
    }

    // Asegurarse de que el evento de clic se registre después de mostrar el selector
    setTimeout(() => {
        document.addEventListener("click", ocultarSelectorFecha);
    }, 0);
});

//Funcion para mostrar en el selector de fechas la fecha seleccionada
function FechaASelector() {
    const fechaSeleccionada = parseToDate(datosAcuario[selectFecha.value].Fecha);
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

// Función para formatear la fecha al modo "12 ago. 2024"
function formatearFecha(fechaISO) {
    let fecha = new Date(fechaISO);
    let opciones = { day: "numeric", month: "short", year: "numeric" };
    let partes = fecha.toLocaleDateString("es-ES", opciones).replace("de ", "").split(" ");
    partes[1] += ".";
    return partes.join(" ");
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

//**************VER DATOS ADICIONALES
document.getElementById("datosAdicionales").addEventListener("click", function() {

    //Obtener el indice desde el dropdown dw fechas
    const index = document.getElementById('selectFecha').value;
    const datos = datosAcuario[index];

    let CO2 = 3 * datos.KH * Math.pow(10, 7 - datos.pH);

    let mensaje = `
        pH = ${datos.pH
          .toFixed(1)
          .toString()
          .replace(".", ",")} - KH = ${datos.KH.toFixed(1).toString().replace(".", ",")}(dKH)<br>CO2 = ${CO2.toFixed(1).toString().replace(".", ",")}(mg/l)<br>
        🌱 Plantas: ${getEstado("plantas", datos.plantas)}<br>
        🌾 Algas: ${getEstado("algas", datos.plantas)}<br>
        🧯 Inyecc. CO2: ${getEstado("inyCO2", datos.inyeccCO2)}<br> 
        🌡️ Temperatura: ${datos.temp}ºC
        `;

    mostrarAlerta(1, `Información Adicional<br>${datos.Fecha}<br>`, mensaje);

});