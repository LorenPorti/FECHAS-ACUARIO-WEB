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

    if (opcion === "tabla") {
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
});


// 🔹 Función para resaltar la celda del CO₂ según el índice seleccionado
function resaltarFechaSeleccionada(indice) {
    let datosSeleccionados = datosAcuario[indice];
    let phSeleccionado = parseFloat(datosSeleccionados.pH);
    let khSeleccionado = parseFloat(datosSeleccionados.KH);

    // 1️⃣ Quitar resaltados previos
    document.querySelectorAll("#tablaPhKh th, #tablaPhKh td").forEach((cell) => {
        cell.style.border = ""; // Eliminar borde de celdas
        cell.style.color = ""; // Restaurar color del texto
        cell.style.fontWeight = "";
    });

    // 1️⃣ Restablecer todos los estilos previos
    document
        .querySelectorAll("#tablaPhKh th, #tablaPhKh td")
        .forEach((cell) => {
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