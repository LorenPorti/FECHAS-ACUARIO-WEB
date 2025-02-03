import { mostrarAlerta } from "./misFunciones.js";

// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));
const params = new URLSearchParams(window.location.search);
const opcion = params.get("opcion"); // Lee el parámetro 'opcion'

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
            break;
    }
});

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
        // Redondeo del khSeleccionado a múltiplos de 0.5, excepto si es menor que 0.5 (se ajusta a 0.1)
        if (khSeleccionado < 0.5) {
            khSeleccionado = 0.1;
        } else {
            khSeleccionado = Math.round(khSeleccionado * 2) / 2;
        }
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

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("celda-resaltada")) {
            let index = event.target.dataset.index; // Asegurar que las celdas tengan `data-index`
            let datos = datosAcuario[index];
            console.log(datos);
            let mensaje = `
            pH = ${datos.pH.toFixed(1).toString().replace(".",",")} - KH = ${datos.KH.toFixed(1).toString().replace(".",",")}<br>
            🌱 Plantas: ${getEstado("plantas", datos.plantas)}<br>
            🌾 Algas: ${getEstado("algas", datos.plantas)}<br>
            🧯 Inyecc. CO2: ${getEstado("inyCO2", datos.inyeccCO2)}<br> 
            🌡️ Temperatura: ${datos.temp}ºC
            `;

            mostrarAlerta(1, `Información Adicional<br>${datos.Fecha}<br>`, mensaje);
        }
    });
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

document.getElementById("irFecha").addEventListener("click", function(event) {
    event.preventDefault();

    const dateInput = document.getElementById("dateInput");

    // Alternar la visibilidad del input
    if (dateInput.style.display === "none" || dateInput.style.display === "") {
        dateInput.style.display = "block";
        dateInput.focus(); // Para que se abra el selector de fecha
    } else {
        dateInput.style.display = "none";
    }

    dateInput.addEventListener("change", function onDateChange(event) {
        let fechaSeleccionada = this.value;
        if (fechaSeleccionada) {
            let fechaFormateada = formatearFecha(fechaSeleccionada);
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