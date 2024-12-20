// Obtener dataConfig y datosAcuario desde localStorage
const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));
const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));
let resultados;
let textoBusquedaActual;

let barraPlantas, barraAlgas, barraAgua, barraSupAgua; // Gauges

document.addEventListener("DOMContentLoaded", function() {

    // Asignar el nombre del acuario al título
    if (dataConfig && dataConfig.nombreDelAcuario) {
        const tituloAcuario = document.getElementById("tituloAcuario");
        tituloAcuario.textContent = dataConfig.nombreDelAcuario;
    }

    crearGauges();

    buscarComentarios();

    //Inicia icono Inyección de CO2 con 1px tranparente
    document.getElementById('iconoCO2').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
});

let options = {
    renderTo: '', // ID del canvas
    height: 80,
    minValue: 0,
    maxValue: 4,
    animationRule: 'linear', // Tipo de animación
    animation: true, // Habilitar animación
    animationDuration: 500, // Duración de la animación en milisegundos
    value: 0, // Valor inicial
    barBeginCircle: false, // Barra lineal
    barWidth: 18,
    borders: false, // Sin bordes
    /* colorBarProgress: 'red', */
    colorBar: '#e0e0e0',
    colorPlate: "#B3C8CF",
    strokeTicks: false,
    colorStrokeTicks: '#B3C8CF',
    colorUnits: '#B3C8CF',
    colorNumbers: '#B3C8CF',
    colorNeedle: 'transparent',
    colorNeedleEnd: 'transparent',
    colorMinorTicks: '#B3C8CF',
    borderShadowWidth: 0,
};

function crearGauges() {

    options.renderTo = 'gaugePlantas';
    barraPlantas = new LinearGauge(options).draw();

    // Aplicar un gradiente personalizado a la barra de progreso
    let canvas = document.getElementById('gaugePlantas');
    let ctx = canvas.getContext('2d');

    // Crear el gradiente
    let gradiente = ctx.createLinearGradient(-80, 0, 85, 0); // Gradiente horizontal
    gradiente.addColorStop(0, '#4CAF50'); // Verde
    gradiente.addColorStop(0.55, '#FFEB3B'); // Amarillo
    gradiente.addColorStop(0.80, 'orange'); // Amarillo
    gradiente.addColorStop(1, '#F44336'); // Rojo

    // Actualizar el gauge para usar el gradiente
    barraPlantas.update({
        colorBarProgress: gradiente,
        value: 0,
    });
    // **********************************
    options.renderTo = 'gaugeAlgas';
    barraAlgas = new LinearGauge(options).draw();

    canvas = document.getElementById('gaugeAlgas');
    ctx = canvas.getContext('2d');

    // Crear el gradiente
    gradiente = ctx.createLinearGradient(-80, 0, 85, 0); // Gradiente horizontal
    gradiente.addColorStop(0, '#4CAF50'); // Verde
    gradiente.addColorStop(0.55, '#FFEB3B'); // Amarillo
    gradiente.addColorStop(0.80, 'orange'); // Amarillo
    gradiente.addColorStop(1, '#F44336'); // Rojo

    // Actualizar el gauge para usar el gradiente
    barraAlgas.update({
        colorBarProgress: gradiente,
        value: 0,
    });
    // **********************************
    options.renderTo = 'gaugeAgua';
    barraAgua = new LinearGauge(options).draw();

    canvas = document.getElementById('gaugeAgua');
    ctx = canvas.getContext('2d');

    // Crear el gradiente
    gradiente = ctx.createLinearGradient(-80, 0, 85, 0); // Gradiente horizontal
    gradiente.addColorStop(0, '#4CAF50'); // Verde
    gradiente.addColorStop(0.55, '#FFEB3B'); // Amarillo
    gradiente.addColorStop(0.80, 'orange'); // Amarillo
    gradiente.addColorStop(1, '#F44336'); // Rojo

    // Actualizar el gauge para usar el gradiente
    barraAgua.update({
        colorBarProgress: gradiente,
        value: 0,
    });
    // **********************************
    options.renderTo = 'gaugeSupAgua';
    barraSupAgua = new LinearGauge(options).draw();

    canvas = document.getElementById('gaugeSupAgua');
    ctx = canvas.getContext('2d');

    // Crear el gradiente
    gradiente = ctx.createLinearGradient(-80, 0, 85, 0); // Gradiente horizontal
    gradiente.addColorStop(0, '#4CAF50'); // Verde
    gradiente.addColorStop(0.55, '#FFEB3B'); // Amarillo
    gradiente.addColorStop(0.80, 'orange'); // Amarillo
    gradiente.addColorStop(1, '#F44336'); // Rojo

    // Actualizar el gauge para usar el gradiente
    barraSupAgua.update({
        colorBarProgress: gradiente,
        value: 0,
    });

}

// Actualizar controles de navegación
function actualizarControles() {
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const contadorResultados = document.getElementById("contadorResultados");

    if (resultados.length > 0) {
        btnAnterior.disabled = false;
        btnSiguiente.disabled = false; // Siempre habilitados con ciclo
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
        document.getElementById("fecha-resultado").textContent = "\u00A0"; // Espacio en blanco
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

        //Inicia icono Inyección de CO2 con 1px tranparente
        document.getElementById('iconoCO2').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        //Pone los gauges a cero
        barraPlantas.value = 0;
        barraAlgas.value = 0;
        barraAgua.value = 0;
        barraSupAgua.value = 0;

        return; // Salimos de la función si el texto de búsqueda está vacío
    }

    // Aquí va el código de la búsqueda cuando el texto no está vacío
    buscarComentarios();
});

document.getElementById("clearBusqueda").addEventListener("click", function() {
    // Borrar el texto de búsqueda
    document.getElementById("inputBusqueda").value = "";

    // Llamar al evento del botón de búsqueda para borrar los resultados
    document.getElementById("btnBuscar").click();

    mostrarInstrucciones();
});

// Navegación entre resultados
document.getElementById("btnAnterior").addEventListener("click", () => {
    if (resultados.length > 0) {
        if (indiceActual > 0) {
            indiceActual--;
        } else {
            indiceActual = resultados.length - 1; // Ciclar al final
        }
        actualizarResultado();
        actualizarControles(); // Asegura que los botones estén habilitados después del ciclo
    }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {

    // if (indiceActual < resultados.length - 1) {
    //     indiceActual++;
    if (resultados.length > 0) {
        indiceActual = (indiceActual < resultados.length - 1) ? indiceActual + 1 : 0;
        actualizarResultado();
        actualizarControles();
    }
    // }
});

function normalizarTexto(texto) {
    // Elimina acentos y pasa a minúsculas
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function eliminarAcentos(texto) {
    return texto
        .normalize("NFD") // Descompone caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // Elimina los caracteres diacríticos (acentos)
        .toLowerCase(); // Convierte todo a minúsculas
}

function marcarPalabras(textoOriginal, subs) {
    let textoResaltado = textoOriginal; // Mantener el texto original para el resaltado

    // Crear una copia del texto original sin acentos
    const textoSinAcentos = eliminarAcentos(textoOriginal);

    // Procesar cada palabra de búsqueda
    subs.forEach(palabra => {
        const palabraSinAcentos = eliminarAcentos(palabra);
        let textoResaltadoTemporal = ""; // Para construir el texto resaltado paso a paso
        let posicionActual = 0;

        // Buscar todas las ocurrencias de la palabra en el texto sin acentos
        while (true) {
            // Encuentra la siguiente coincidencia
            const startIndex = textoSinAcentos.indexOf(palabraSinAcentos, posicionActual);

            // Si no hay más coincidencias, salir del bucle
            if (startIndex === -1) {
                textoResaltadoTemporal += textoResaltado.slice(posicionActual);
                break;
            }

            // Añadir el texto desde la posición actual hasta el inicio de la coincidencia
            textoResaltadoTemporal += textoResaltado.slice(posicionActual, startIndex);

            // Resaltar la coincidencia original en el texto con acentos
            const coincidenciaOriginal = textoResaltado.slice(startIndex, startIndex + palabra.length);
            textoResaltadoTemporal += `<span class="highlight">${coincidenciaOriginal}</span>`;

            // Actualizar la posición actual
            posicionActual = startIndex + palabra.length;
        }

        // Actualizar textoResaltado con el texto ajustado
        textoResaltado = textoResaltadoTemporal;
    });

    return textoResaltado;
}

// Función para buscar textos en los comentarios, hasta tres palabras separadas por un espacio. Se puede incluir frases completas entre comillas
//Por ejemplo 'pH está bajo' busca todos los comentarios que contengan 'ph', 'esta'y 'bajo', ignorando los acentos y las mayúsculas,
//después los resaltará tal como estaban en el comentario original. Si la búsqueda es '"pH está bajo" agua', busca todos los coemntarios que
//contengan 'agua' y la frase 'ph esta bajo' e igualmente serán resaltados
function buscarComentarios() {

    const textoBusqueda = document.getElementById("inputBusqueda").value.trim().toLowerCase();

    if (!textoBusqueda) {
        return;
    }

    const palabrasBusqueda = obtenerPalabrasYFrases(textoBusqueda); //Guarda en el array palabrasBusqueda las frases o palabras para buscar quitando las comillas 

    textoBusquedaActual = palabrasBusqueda; // Guardamos las palabras de búsqueda

    if (palabrasBusqueda.some(element => element.length < 2)) {
        return; // Salir de la función si alguna palabra tiene menos de 2 caracteres
    }

    // Filtramos los comentarios que contienen todas las palabras de búsqueda
    resultados = datosAcuario.filter(dato => {
        const comentarioLower = eliminarAcentos(dato.comentario.toLowerCase());
        const coincideTexto = palabrasBusqueda.every(palabra => comentarioLower.includes(palabra));
        return coincideTexto;
    });

    if (resultados.length === 0) {
        alert("No se encontraron coincidencias.");
    }

    indiceActual = 0;
    actualizarResultado();
    actualizarControles();
}

function actualizarResultado() {
    const fechaResultado = document.getElementById("fecha-resultado");
    const comentarioResultado = document.getElementById("comentarioResultado");


    if (resultados.length > 0) {
        const resultado = resultados[indiceActual];
        fechaResultado.textContent = resultado.Fecha;

        mostrarFecha(resultado.Fecha);

        // Resaltamos las palabras de búsqueda en el comentario
        let comentarioConResaltado = resultado.comentario;

        // Mantener los saltos de línea
        comentarioConResaltado = comentarioConResaltado.replace(/\n/g, "<br>");

        if (textoBusquedaActual && textoBusquedaActual.length > 0) {
            textoBusquedaActual.forEach(palabra => {
                comentarioConResaltado = marcarPalabras(comentarioConResaltado, [palabra]);
            });
        }

        comentarioResultado.innerHTML = comentarioConResaltado;
        comentarioResultado.style.color = "#000";

        // Actualizamos los datos adicionales
        document.getElementById("valorPH").textContent = `${resultado.pH.toFixed(1).toString().replace(".", ",")}`;
        document.getElementById("valorKH").textContent = `${resultado.KH.toFixed(1).toString().replace(".", ",")}`;
        document.getElementById("valorTemp").textContent = `${resultado.temp}(ºC)`;
        document.getElementById("valorNO3").textContent = `${resultado.NO3}(ppm)`;
        document.getElementById("valorCO2").textContent = `${resultado.CO2.toFixed(2).toString().replace(".", ",")}(mg/l)`;

        //Resultado inyección CO2
        switch (resultado.inyeccCO2) {
            case 1:
                document.getElementById('iconoCO2').src = './imagenes/CO2 con Levadura.png';
                break;
            case 2:
                document.getElementById('iconoCO2').src = './imagenes/CO2 con Botella Presión.png';
                break;
            case 3:
                document.getElementById('iconoCO2').src = './imagenes/Sin CO2.png';
                break;
        }

        barraPlantas.value = resultado.plantas + 1;
        barraAlgas.value = resultado.algas + 1;
        barraAgua.value = resultado.agua + 1;
        barraSupAgua.value = resultado.sup_agua + 1;
    } else {
        fechaResultado.textContent = "\u00A0"; // Espacio en blanco (no visible)
        comentarioResultado.innerHTML = "No hay resultados, realizar una búsqueda.";
        comentarioResultado.style.color = "gray";

        // Limpiamos los datos
        document.getElementById("valorPH").textContent = "";
        document.getElementById("valorKH").textContent = "";
        document.getElementById("valorTemp").textContent = "";
        document.getElementById("valorNO3").textContent = "";
        document.getElementById("valorCO2").textContent = "";

        //Inicia icono Inyección de CO2 con 1px tranparente
        document.getElementById('iconoCO2').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        barraPlantas.value = 0;
        barraAgua.value = 0;
        barraAlgas.value = 0;
        barraSupAgua.value = 0;

        mostrarInstrucciones();
    }
}

function obtenerPalabrasYFrases(textoBusqueda) {
    const palabrasYFrases = [];

    // Extraer frases exactas entre comillas
    const matches = textoBusqueda.match(/"([^"]+)"/g);
    if (matches) {
        matches.forEach(match => {
            const fraseSinComillas = match.replace(/"/g, "").trim(); // Eliminar comillas
            palabrasYFrases.push(fraseSinComillas);
        });
    }

    // Eliminar las frases exactas para procesar palabras restantes
    const textoSinFrases = textoBusqueda.replace(/"([^"]+)"/g, "").trim();
    if (textoSinFrases) {
        const palabras = textoSinFrases.split(/\s+/).filter(palabra => palabra.length > 0); // Dividir en palabras
        palabrasYFrases.push(...palabras);
    }

    for (i = 0; i < palabrasYFrases.length; i++) {
        palabrasYFrases[i] = eliminarAcentos(palabrasYFrases[i]);
    }

    return palabrasYFrases; // Array combinado
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modalInfoBuscar");
    if (event.target === modal) {
        cerrarModal();
    }
});

function cerrarModal() {
    const modal = document.getElementById("modalInfoBuscar");
    modal.style.display = "none"; // Cambiar estilo para ocultar el modal
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

function calcularTendencia(datosAcuario, tipoTendencia, indice) {
    // Garantizar que el índice esté dentro de los límites
    indice = Math.max(0, Math.min(indice, datosAcuario.length - 1));

    // Prepara los valores X e Y según el tipo de tendencia
    const valX = [];
    const valY = [];

    datosAcuario.forEach((dato, i) => {
        valX.push(i); // X: Índices de tiempo
        switch (tipoTendencia) {
            case 0:
                valY.push(dato.resultado); // Tendencia general
                break;
            case 1:
                valY.push(dato.NO3); // Tendencia nitratos
                break;
            case 2:
                valY.push(dato.CO2); // Tendencia CO2
                break;
            default:
                throw new Error("Tipo de tendencia no válido");
        }
    });

    // Calcular la pendiente (a) y la intersección (b) de la recta (regresión lineal)
    const n = valX.length;
    const sumX = valX.reduce((sum, x) => sum + x, 0);
    const sumY = valY.reduce((sum, y) => sum + y, 0);
    const sumXY = valX.reduce((sum, x, i) => sum + x * valY[i], 0);
    const sumX2 = valX.reduce((sum, x) => sum + x * x, 0);

    // Fórmulas de regresión lineal
    const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - a * sumX) / n;

    // Calcular el valor de la tendencia en el índice solicitado
    const y = a * indice + b;

    return y.toFixed(2); // Redondeamos el resultado a 3 decimales
}

document.getElementById("fecha-resultado").addEventListener("click", function() {
    const txtFecha = document.getElementById('fecha-resultado');
    const modal = document.getElementById("modalInfoBuscar");

    const indice = datosAcuario.findIndex(dato => dato.Fecha === txtFecha.textContent);

    let dato1, dato2;

    let diferenciaEstado = "";
    let signo = "";
    if (indice == 0) {
        dato2 = 0;
        dato1 = 0;
        diferenciaEstado = "ESTABLE ";
        signo = "±";
    } else {
        dato1 = datosAcuario[indice - 1].tendencia.toFixed(3);
        dato2 = datosAcuario[indice].tendencia.toFixed(3);
        if (dato2 - dato1 > 0) {
            diferenciaEstado = "DESFAVORABLE ";
            signo = "+";
        } else if (dato2 - dato1 < 0) {
            diferenciaEstado = "FAVORABLE ";
            signo = "";
        } else if (dato2 == dato1) {
            diferenciaEstado = "ESTABLE ";
            signo = "±";
        }
    }

    // Rellenar los elementos del modal con los datos
    document.getElementById("modal-title").innerText = datosAcuario[indice].Fecha;
    document.getElementById("modal-datos").innerHTML = `» La diferencia con valores anteriores de la regresión lineal Gral es <b style="color: Maroon; font-style: italic; ">${diferenciaEstado}</b>(${signo}${(dato2-dato1).toFixed(3).replace(".",",")}).`;
    document.getElementById("modalPH").innerHTML = `<b style="color: Maroon;">pH:</b> ${datosAcuario[indice].pH.toFixed(1).toString().replace(".", ",")}`;
    document.getElementById("modalKH").innerHTML = `<b style="color: Maroon;">KH:</b> ${datosAcuario[indice].KH} dKH`;
    document.getElementById("modalTemp").innerHTML = `<b style="color: Maroon; ">Temperatura:</b> ${datosAcuario[indice].temp} ºC`;
    document.getElementById("modalCO2").innerHTML = `<b style="color: Maroon; ">CO2:</b> ${datosAcuario[indice].CO2.toFixed(2).toString().replace(".", ",")} mg/l`;
    document.getElementById("modalNO3").innerHTML = `<b style="color: Maroon; ">NO3:</b> ${datosAcuario[indice].NO3} ppm`;
    document.getElementById("modalPlantas").innerHTML = `<b style="color: Maroon; ">Plantas:</b> ${getEstado("plantas", datosAcuario[indice].plantas)}`;
    document.getElementById("modalAgua").innerHTML = `<b style="color: Maroon; ">Agua:</b> ${getEstado("agua", datosAcuario[indice].agua)}`;
    document.getElementById("modalAlgas").innerHTML = `<b style="color: Maroon; ">Algas:</b> ${getEstado("algas", datosAcuario[indice].algas)}`;
    document.getElementById("modalSupAgua").innerHTML = `<b style="color: Maroon; ">Superf. agua:</b> ${getEstado("supAgua", datosAcuario[indice].sup_agua)}`;
    document.getElementById("modalInyCO2").innerHTML = `<b style="color: Maroon; ">Inyección de CO2:</b> ${getEstado("inyCO2", datosAcuario[indice].inyeccCO2)}`;
    document.getElementById("modalTendGral").innerHTML = `<b style="color: Maroon; ">Regresión lineal Gral:</b> ${datosAcuario[indice].tendencia.toFixed(3).toString().replace(".", ",")} - (Óptimo = 0,000)`;
    document.getElementById("modalTendNO3").innerHTML = `<b style="color: Maroon; ">Regresión lineal NO3:</b> ${calcularTendencia(datosAcuario,1,indice).replace(".", ",")} - (Ópt. = 5-10 ppm)`;
    document.getElementById("modalTendCO2").innerHTML = `<b style="color: Maroon; ">Regresión lineal CO2:</b> ${calcularTendencia(datosAcuario, 2, indice).replace(".", ",")} - (Ópt. = 6-15 mg/l)`;
    console.log(calcularTendencia(datosAcuario, 2, indice));
    document.getElementById("modal-comments").textContent = `${datosAcuario[indice].comentario}`;

    modal.style.display = "block";
});

// Mostrar las instrucciones
function mostrarInstrucciones() {
    const instrucciones = document.getElementById('instrucciones');
    const fechaResultado = document.getElementById('fecha-resultado');

    instrucciones.style.display = 'block'; // Muestra instrucciones
    fechaResultado.style.display = 'none'; // Oculta la fecha
    fechaResultado.innerText = ''; // Limpia el texto de la fecha
}

// Mostrar la fecha
function mostrarFecha(fecha) {
    const instrucciones = document.getElementById('instrucciones');
    const fechaResultado = document.getElementById('fecha-resultado');

    instrucciones.style.display = 'none'; // Oculta instrucciones
    fechaResultado.style.display = 'block'; // Muestra la fecha
    fechaResultado.innerText = fecha; // Establece la fecha
}