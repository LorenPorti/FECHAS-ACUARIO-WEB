// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));

document.addEventListener("DOMContentLoaded", function() {
    // Asignar el nombre del acuario al título
    if (dataConfig && dataConfig.nombreDelAcuario) {
        const tituloAcuario = document.getElementById("tituloAcuario");
        tituloAcuario.textContent = dataConfig.nombreDelAcuario;
    }

    buscarComentarios();
});

let textoBusquedaActual = ""; // Variable global para almacenar el término de búsqueda

function buscarComentarios() {
    const textoBusqueda = document.getElementById("inputBusqueda").value.trim().toLowerCase();
    const incluirPlantas = document.getElementById("checkPlantas").checked;
    const incluirAlgas = document.getElementById("checkAlgas").checked;

    if (!textoBusqueda) {
        // alert("Por favor, escribe algo para buscar.");
        return;
    }

    // Dividimos el texto de búsqueda en palabras (máximo 3 términos)
    const palabrasBusqueda = textoBusqueda.split(" ").filter(palabra => palabra.length > 0).slice(0, 3);
    textoBusquedaActual = palabrasBusqueda; // Guardamos las palabras de búsqueda

    // Filtramos los comentarios que contienen todas las palabras de búsqueda
    resultados = datosAcuario.filter(dato => {
        const comentarioLower = dato.comentario.toLowerCase();
        const coincideTexto = palabrasBusqueda.every(palabra => comentarioLower.includes(palabra));
        const coincidePlantas = !incluirPlantas || dato.plantas > 0;
        const coincideAlgas = !incluirAlgas || dato.algas > 0;
        return coincideTexto && (coincidePlantas || coincideAlgas);
    });

    if (resultados.length === 0) {
        alert("No se encontraron coincidencias.");
    }

    indiceActual = 0;
    actualizarResultado();
    actualizarControles();
}

function actualizarResultado() {
    const fechaResultado = document.getElementById("fecha-resultado").querySelector("p");
    const comentarioResultado = document.getElementById("comentarioResultado");

    document.getElementById("fecha-resultado").style.display = "block";

    if (resultados.length > 0) {
        const resultado = resultados[indiceActual];
        fechaResultado.textContent = resultado.Fecha;

        // Resaltamos las palabras de búsqueda en el comentario
        let comentarioConResaltado = resultado.comentario;
        if (textoBusquedaActual && textoBusquedaActual.length > 0) {
            textoBusquedaActual.forEach(palabra => {
                const regex = new RegExp(`(${palabra})`, "gi");
                comentarioConResaltado = comentarioConResaltado.replace(regex, `<span class="highlight">$1</span>`);
            });
        }
        comentarioResultado.innerHTML = comentarioConResaltado;
        comentarioResultado.style.color = "#000";

        // Actualizamos los datos adicionales
        document.getElementById("valorPH").textContent = resultado.pH.toFixed(1).toString().replace(".", ",");
        document.getElementById("valorKH").textContent = `${resultado.KH.toFixed(1).toString().replace(".", ",")} dKH`;
        document.getElementById("valorTemp").textContent = `${resultado.temp} ºC`;
        document.getElementById("valorNO3").textContent = `${resultado.NO3} ppm`;
        document.getElementById("valorCO2").textContent = `${resultado.CO2.toFixed(2).toString().replace(".", ",")} mg/l`;
    } else {
        fechaResultado.textContent = "";
        comentarioResultado.innerHTML = "No hay resultados, realizar una búsqueda.";
        comentarioResultado.style.color = "gray";

        // Limpiamos los datos
        document.getElementById("valorPH").textContent = "";
        document.getElementById("valorKH").textContent = "";
        document.getElementById("valorTemp").textContent = "";
        document.getElementById("valorNO3").textContent = "";
        document.getElementById("valorCO2").textContent = "";
    }
}

// Actualizar controles de navegación
function actualizarControles() {
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const contadorResultados = document.getElementById("contadorResultados");

    if (resultados.length > 0) {
        btnAnterior.disabled = indiceActual === 0;
        btnSiguiente.disabled = indiceActual === resultados.length - 1;
        contadorResultados.textContent = `${indiceActual + 1} / ${resultados.length}`;
    } else {
        btnAnterior.disabled = true;
        btnSiguiente.disabled = true;
        contadorResultados.textContent = "0 / 0";
    }
}

document.getElementById("btnBuscar").addEventListener("click", function() {
    const textoBusqueda = document.getElementById("inputBusqueda").value.trim();

    if (textoBusqueda === "") {
        // Si el texto de búsqueda está vacío, limpiamos los resultados
        document.getElementById("comentarioResultado").textContent = "No hay resultados, realizar una búsqueda.";
        document.getElementById("fecha-resultado").style.display = "none";
        document.getElementById("control-resultados").style.display = "none";
        document.getElementById("resultados-extra").style.display = "none";
        document.getElementById("contadorResultados").textContent = "0 / 0";
        document.getElementById("btnAnterior").disabled = true;
        document.getElementById("btnSiguiente").disabled = true;

        // Limpiar los valores de pH, KH, Temp, NO3 y CO2
        document.getElementById("valorPH").textContent = "";
        document.getElementById("valorKH").textContent = "";
        document.getElementById("valorTemp").textContent = "";
        document.getElementById("valorNO3").textContent = "";
        document.getElementById("valorCO2").textContent = "";

        return; // Salimos de la función si el texto de búsqueda está vacío
    }

    // Aquí va el código de la búsqueda cuando el texto no está vacío
    buscarComentarios(textoBusqueda);
});

document.getElementById("clearBusqueda").addEventListener("click", function() {
    // Borrar el texto de búsqueda
    document.getElementById("inputBusqueda").value = "";

    // Llamar al evento del botón de búsqueda para borrar los resultados
    document.getElementById("btnBuscar").click();
});

// Navegación entre resultados
document.getElementById("btnAnterior").addEventListener("click", () => {
    if (indiceActual > 0) {
        indiceActual--;
        actualizarResultado();
        actualizarControles();
    }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {
    if (indiceActual < resultados.length - 1) {
        indiceActual++;
        actualizarResultado();
        actualizarControles();
    }
});

// Evento para buscar
document.getElementById("btnBuscar").addEventListener("click", buscarComentarios);