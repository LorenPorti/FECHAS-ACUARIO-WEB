// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));
const params = new URLSearchParams(window.location.search);
const opcion = params.get("opcion"); // Lee el parámetro 'opcion'

// Insertar el título del acuario en la cabecera
document.getElementById("tituloAcuario").textContent = dataConfig.nombreDelAcuario;

// Referencia al modal y su cuerpo
const modal = document.getElementById("modalPhKh");

//Muestra modal
document.addEventListener("DOMContentLoaded", () => {

    const modalBootstrap = new bootstrap.Modal(modal);
    const modalTitulo = document.getElementById("modalPhKhLabel");
    const botonRepetir = document.getElementById("boton-otra-cosa");

    switch (opcion) {
        case "tabla":
            modalTitulo.textContent = "Tabla PH/KH";
            botonRepetir.textContent = "Volver a mostrar tabal PH/KH";

            const tabla = document.getElementById("tablaPhKh");
            const tablaHead = tabla.querySelector("thead tr");
            const tablaBody = tabla.querySelector("tbody");

            const phMin = 5.5,
                phMax = 7.5,
                phStep = 0.1;
            const khMin = 0,
                khMax = 10,
                khStep = 0.5;

            // Agregar encabezados de pH
            for (let ph = phMin; ph <= phMax; ph += phStep) {
                let th = document.createElement("th");
                th.textContent = ph.toFixed(1).toString().replace(".", ",");
                tablaHead.appendChild(th);
            }

            // Generar filas de KH y datos de CO2
            for (let kh = khMin; kh <= khMax; kh += khStep) { // Corregido orden de KH
                let row = document.createElement("tr");
                let khCell = document.createElement("td");
                khCell.innerHTML = `<p style="height: 4px; font-weight: bold; color: white; margin-top: 4px;">${kh.toFixed(1).toString().replace(".", ",")}</p>`;
                if (khCell.textContent == "0,0") khCell.innerHTML = `<p style="height: 4px; font-weight: bold; color: white; margin-top: 4px;">0,1</p>`;
                khCell.style.background = '#659287';
                row.appendChild(khCell);

                for (let ph = phMin; ph <= phMax; ph += phStep) {
                    let co2 = 3 * kh * Math.pow(10, (7 - ph));
                    let color = (co2 >= 9 && co2 <= 40) ? "#b3e6b3" : "#f5c6c6";
                    let cell = document.createElement("td");
                    cell.style.background = color;
                    cell.textContent = co2.toFixed(1).toString().replace(".", ",");
                    row.appendChild(cell);
                }
                tablaBody.appendChild(row);
            }

            break;
        case "analisis":
            modalTitulo.textContent = "Análisis Agua Red";
            botonRepetir.textContent = "Volver a mostrar Análisis Agua Red";
            break;
    }

    modalBootstrap.show();

    // Mostrar el modal al hacer clic en el botón
    botonRepetir.addEventListener("click", () => {
        modalBootstrap.show();
    });
});