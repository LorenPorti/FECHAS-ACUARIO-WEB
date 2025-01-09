// Obtiene los parámetros de la URL
const params = new URLSearchParams(window.location.search);
let opcion = params.get("opcion"); // Lee el parámetro 'opcion'
// URL base de GitHub para los archivos JSON
const githubBaseUrl = "https://raw.githubusercontent.com/LorenPorti/FECHAS-ACUARIO-WEB/main/";
const fileUrlRecetas = `${githubBaseUrl}recetas.json`; // URL completa para el archivo en GitHub
const fileUrlProcedimientos = `${githubBaseUrl}procedimientos.json`; // URL completa para el archivo en GitHub
const body = document.querySelector('tbody'); // Selecciona el primer <tbody>
let datosRecetas = [];
let datosProcedimientos = [];

document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById("tituloRecetas");
    const icono = document.getElementById("iconoRecetas");
    const botonOtra = document.getElementById("boton-otra-cosa");

    switch (opcion) {
        case "recetas":
            titulo.textContent = "Recetas";
            botonOtra.textContent = "Ir a Procedimientos";
            icono.src = "./imagenes/recetas.png";
            desplegar(opcion);
            break;
        case "procedimientos":
            titulo.textContent = "Procedimientos";
            botonOtra.textContent = "Ir a Recetas";
            icono.src = "./imagenes/procedimientos.png";
            desplegar(opcion);
            break;
    }

    botonOtra.addEventListener("click", function(event) {
        switch (opcion) {
            case "recetas":
                desplegar("procedimientos");
                opcion = "procedimientos";
                titulo.textContent = "Procedimientos";
                botonOtra.textContent = "Ir a Recetas";
                icono.src = "./imagenes/procedimientos.png";
                break;
            case "procedimientos":
                desplegar("recetas");
                opcion = "recetas";
                titulo.textContent = "Recetas";
                botonOtra.textContent = "Ir a Procedimientos";
                icono.src = "./imagenes/recetas.png";
                break;
        }
    });
});

// Delegar el evento clic en el <tbody> una sola vez
body.addEventListener('click', function(event) {
    const clickedRow = event.target.closest('.clickable-row'); // Verifica si el clic fue en una fila
    if (clickedRow) {
        presentar(clickedRow.rowIndex);
    }
});

function desplegar(opcionBoton) {
    switch (opcionBoton) {
        case "recetas":
            procesarRecetas();
            break;
        case "procedimientos":
            procesarProcedimientos();
            break;
    }
}

function procesarRecetas() {
    fetch(fileUrlRecetas)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            return response.json(); // Convierte el contenido en un objeto
        })
        .then(data => {
            body.innerHTML = "";
            datosRecetas = [];
            data.forEach(receta => {
                body.innerHTML += `<tr class="clickable-row"><th scope="row" class="roboto-medium-italic">${receta.NOMBRE_RECETA}</th></tr>`;
                datosRecetas.push(receta);
            });
        });
}

function procesarProcedimientos() {
    fetch(fileUrlProcedimientos)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
            }
            return response.json(); // Convierte el contenido en un objeto
        })
        .then(data => {
            body.innerHTML = "";
            datosProcedimientos = [];
            data.forEach(procedimiento => {
                body.innerHTML += `<tr class="clickable-row"><th scope="row" class="roboto-medium-italic">${procedimiento.NOMBRE_DEL_PROCEDIMIENTO}</th></tr>`;
                datosProcedimientos.push(procedimiento);
            });
        });
}

function presentar(indice) {

    // Referencia al modal y su cuerpo
    const modal = document.getElementById("modalRecetas");
    const modalTitulo = document.getElementById("modalRecetasLabel");
    const modalCuerpo = document.getElementById("contenidoRecetasModal");

    // Preparar el contenido con formato adecuado
    let contenido = "<pre style='font-family: monospace; white-space: no-wrap; text-align: left; margin: 0;'>";

    switch (opcion) {
        case "recetas":
            // Cambiar el título del modal
            modalTitulo.textContent = `${datosRecetas[indice].NOMBRE_RECETA}`;
            modalTitulo.style.color = "white";
            document.getElementsByClassName("modal-header")[0].style.background = "#A28B55";

            contenido += '<div class="d-flex flex-column g-1">';

            contenido += `
                <span class="d-flex flex-wrap flex-column g-1">
                    <p class="georgia-bold-italic" style="margin: 0;color: blue;">Ingredientes: </p>
                    <p class="georgia-medium" style="margin: 0; color: black; text-wrap: wrap;">${datosRecetas[indice].INGREDIENTES}</p> 
                </span>
                <span class="d-flex flex-wrap flex-column g-1">
                    <p></p>
                    <p class="georgia-bold-italic" style="margin: 0;color: blue;">Elaboración: </p>
                    <p class="georgia-medium" style="margin: 0; color: black; text-wrap: wrap;">${datosRecetas[indice].ELABORACION}</p>
                </span>
                `;
            contenido += '</div>';
            contenido += "</pre>";

            // Insertar el contenido generado en el cuerpo del modal
            modalCuerpo.innerHTML = contenido;
            break;
        case "procedimientos":
            modalTitulo.textContent = `${datosProcedimientos[indice].NOMBRE_DEL_PROCEDIMIENTO}`;
            modalTitulo.style.color = "white";
            document.getElementsByClassName("modal-header")[0].style.background = "#A28B55";

            contenido += '<div class="d-flex flex-column g-1">';

            let contenidoOperaciones = "";
            let dato = datosProcedimientos[indice];

            Object.keys(dato).forEach((clave) => {
                if (clave.startsWith("tarea_") && dato[clave].trim() !== "") {
                    const numeroTarea = clave.split("_")[1]; // Extrae el número de la tarea
                    contenidoOperaciones += `
                    <span class="d-flex flex-row g-1">
                        <p class="georgia-medium" style="margin: 0; color: maroon;"> ${numeroTarea}.- </p>
                        <p class="georgia-medium" style="margin: 0; color: black; text-wrap: wrap; text-align: justify;">${dato[clave]}</p>
                    </span>
                    `;
                }
            });

            contenido += `
                <span class="d-flex flex-wrap flex-column g-1">
                    <div class="d-flex">    
                        <p class="georgia-bold-italic" style="margin: 0;color: blue;">Fecha última revisión: </p>
                        <p class="georgia-bold" style="margin: 0;color: black;">${datosProcedimientos[indice].fecha_PROCEDIMIENTO}</p>
                    </div>
                    <div class="d-flex">    
                        <p class="georgia-bold-italic" style="margin: 0;color: blue;">Objetivo: </p>
                        <p class="georgia-bold" style="margin: 0;color: black; text-wrap: wrap;">${datosProcedimientos[indice].OBJETIVO_DEL_PROCEDIMIENTO}</p>
                    </div>
                    <p class="georgia-medium" style="margin: 0; color: black; text-wrap: wrap;"></p> 
                </span>
                <span class="d-flex flex-wrap flex-column g-1">
                    <p></p>
                    <p class="georgia-bold-italic" style="margin: 0;color: #196f3d ;text-decoration: underline;">Operaciones: </p>
                    ${contenidoOperaciones}
                </span>
                `;
            contenido += '</div>';
            contenido += "</pre>";

            // Insertar el contenido generado en el cuerpo del modal
            modalCuerpo.innerHTML = contenido;
            break;

    }

    // Aplicar altura máxima al modal
    modalCuerpo.style.maxHeight = "75vh";
    modalCuerpo.style.overflowY = "auto";

    // Mostrar el modal
    const modalBootstrap = new bootstrap.Modal(modal);
    modalBootstrap.show();


}