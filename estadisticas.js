document.addEventListener("DOMContentLoaded", function() {
    // Recuperar datos de localStorage
    const datosAcuario = JSON.parse(localStorage.getItem("datosAcuario"));
    const dataConfig = JSON.parse(localStorage.getItem("dataConfig"));

    // Actualizar cabecera
    actualizarCabecera(datosAcuario, dataConfig);

    // Si hay datos disponibles
    if (datosAcuario) {
        // Cargar tarjeta pH
        cargarTarjeta("pH", datosAcuario, "tarjetaPH");
        // Cargar tarjeta KH
        cargarTarjeta("KH", datosAcuario, "tarjetaKH");
        // Cargar tarjeta Temperatura
        cargarTarjeta("temp", datosAcuario, "tarjetaTemp");
        // Cargar tarjeta Nitrato
        cargarTarjeta("NO3", datosAcuario, "tarjetaNO3");
        // Cargar tarjeta CO2 disuelto
        cargarTarjeta("CO2", datosAcuario, "tarjetaCO2");
        // Cargar tarjeta inyección CO2
        cargarTarjeta("inyeccCO2", datosAcuario, "tarjetaInyeccCo2");

        const parametros = ['PH', 'KH', 'Temperatura', 'NO3', 'CO2', 'InyeccCo2'];
        const valores = ['máximo', 'mínimo', 'repite'];



        // parametros.forEach(parametro => {
        //     valores.forEach(valor => {
        //         const dropdownClass = `dropdown-${valor.toLowerCase()}`;
        //         llenarDropdown(datosAcuario, parametro, valor, dropdownClass);
        //     });
        // });

    }
});

/**
 * Actualiza la cabecera con los datos del acuario
 * @param {Array} datosAcuario - Datos del acuario
 * @param {Object} dataConfig - Configuración del acuario
 */
function actualizarCabecera(datosAcuario, dataConfig) {
    const cabecera = document.getElementById("cabecera");
    const totalRegistros = document.getElementById("total-registros");
    const fechaInicial = document.getElementById("fecha-inicial");
    const fechaFinal = document.getElementById("fecha-final");

    if (dataConfig) {
        cabecera.textContent = `Estadist. ${dataConfig.nombreDelAcuario}`;
    }

    if (datosAcuario) {
        totalRegistros.textContent = datosAcuario.length;

        if (datosAcuario.length > 0) {
            fechaInicial.textContent = datosAcuario[0].Fecha;
            fechaFinal.textContent = datosAcuario[datosAcuario.length - 1].Fecha;
        }
    }
}

//************************************************************* */
function cargarTarjeta(parametro, datosAcuario, selectorTarjeta) {
    // Seleccionar la tarjeta específica
    const tarjeta = document.getElementById(selectorTarjeta);
    if (!tarjeta) return;

    // Seleccionar los elementos de la tarjeta con sus clases
    const maxValorElemento = tarjeta.querySelector(".valor.maximo");
    const minValorElemento = tarjeta.querySelector(".valor.minimo");
    const mediaValorElemento = tarjeta.querySelector(".valor.media");
    const desvioValorElemento = tarjeta.querySelector(".valor.desviacion");
    const repiteValorElemento = tarjeta.querySelector(".valor.masrepite");
    const tendenciaValorElemento = tarjeta.querySelector(".valor.tendencia");
    const cantidadBotellaPresion = document.querySelector("#tarjetaInyeccCo2 .valor.botellaPresion");
    const cantidadLevadura = document.querySelector("#tarjetaInyeccCo2 .valor.Co2Levadura");
    const cantidadSinCo2 = document.querySelector("#tarjetaInyeccCo2 .valor.SinCo2");

    const dropdownMaximo = tarjeta.querySelector(".dropdown-maximo");
    const dropdownMinimo = tarjeta.querySelector(".dropdown-minimo");
    const dropdownRepite = tarjeta.querySelector(".dropdown-repite");

    // Seleccionar los dropdowns
    const dropdownBotPresion = document.querySelector(".dropdown-BotPresion");
    const dropdownCo2Levadura = document.querySelector(".dropdown-Co2Levadura");
    const dropdownSinCo2 = document.querySelector(".dropdown-SinCo2");

    // Obtener los valores para el parámetro
    const values = datosAcuario.map(d => d[parametro]);

    // Calcular máximo, mínimo, media, desviación y moda
    const maxValorParametro = Math.max(...values);
    const minValorParametro = Math.min(...values);
    const mediaParametro = values.reduce((sum, val) => sum + val, 0) / values.length;
    const desviacionParametro = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mediaParametro, 2), 0) / values.length);
    const tendencia = calcularTendenciaEsperada(values);
    const modaParametro = calcularModa(values); // Asumiendo que ya tienes la función calcularModa
    const repeticionBotellaPresion = contarRepeticiones(values, 2);
    const repeticionLevadura = contarRepeticiones(values, 1);
    const repeticionSinCo2 = contarRepeticiones(values, 3);

    if (parametro != "inyeccCO2") {
        // Mostrar los valores en la tarjeta
        maxValorElemento.textContent = maxValorParametro.toFixed(1).toString().replace(".", ",");
        minValorElemento.textContent = minValorParametro.toFixed(1).toString().replace(".", ",");
        mediaValorElemento.textContent = mediaParametro.toFixed(1).toString().replace(".", ",");
        desvioValorElemento.textContent = desviacionParametro.toFixed(1).toString().replace(".", ",");
        repiteValorElemento.textContent = `${modaParametro.valor.toFixed(1).toString().replace(".", ",")} - (${modaParametro.repeticiones})`;
        tendenciaValorElemento.textContent = `${tendencia.proximoValor} - (${tendencia.interpretacion})`;
    } else {
        cantidadBotellaPresion.textContent = `(${repeticionBotellaPresion})`;
        cantidadLevadura.textContent = `(${repeticionLevadura})`;
        cantidadSinCo2.textContent = `(${repeticionSinCo2})`;
    }

    if (parametro == "pH") {
        llenarDropdown(datosAcuario, "PH", maxValorParametro, dropdownMaximo);
        llenarDropdown(datosAcuario, "PH", minValorParametro, dropdownMinimo);
        llenarDropdown(datosAcuario, "PH", modaParametro.valor, dropdownRepite);
    }
    if (parametro == "KH") {
        llenarDropdown(datosAcuario, parametro, maxValorParametro, dropdownMaximo);
        llenarDropdown(datosAcuario, parametro, minValorParametro, dropdownMinimo);
        llenarDropdown(datosAcuario, parametro, modaParametro.valor, dropdownRepite);
    }
    if (parametro == "temp") {
        llenarDropdown(datosAcuario, "Temp", maxValorParametro, dropdownMaximo);
        llenarDropdown(datosAcuario, "Temp", minValorParametro, dropdownMinimo);
        llenarDropdown(datosAcuario, "Temp", modaParametro.valor, dropdownRepite);
    }
    if (parametro == "NO3") {
        llenarDropdown(datosAcuario, parametro, maxValorParametro, dropdownMaximo);
        llenarDropdown(datosAcuario, parametro, minValorParametro, dropdownMinimo);
        llenarDropdown(datosAcuario, parametro, modaParametro.valor, dropdownRepite);
    }
    if (parametro == "CO2") {
        llenarDropdown(datosAcuario, parametro, maxValorParametro, dropdownMaximo);
        llenarDropdown(datosAcuario, parametro, minValorParametro, dropdownMinimo);
        llenarDropdown(datosAcuario, parametro, modaParametro.valor, dropdownRepite);
    }
    if (parametro == "inyeccCO2") {
        llenarDropdown(datosAcuario, "InyeccCo2", 2, dropdownBotPresion);
        llenarDropdown(datosAcuario, "InyeccCo2", 1, dropdownCo2Levadura);
        llenarDropdown(datosAcuario, "InyeccCo2", 3, dropdownSinCo2);
    }
    // // Llenar los dropdowns con las fechas de los valores extremos
    // if (parametro == "pH") parametro = "PH";
    // if (parametro === "temp") parametro = "Temp";
    // llenarDropdown(datosAcuario, parametro, maxValorParametro, dropdownMaximo);
    // llenarDropdown(datosAcuario, parametro, minValorParametro, dropdownMinimo);
    // llenarDropdown(datosAcuario, parametro, modaParametro.valor, dropdownRepite);

    // // Rellenar los dropdowns usando la función existente
    // llenarDropdown(datosAcuario, "InyeccCO2", 2, dropdownBotPresion);
    // llenarDropdown(datosAcuario, "InyeccCO2", 1, dropdownCo2Levadura);
    // llenarDropdown(datosAcuario, "InyeccCO2", 3, dropdownSinCo2);
}

function contarRepeticiones(values, objetivo) {
    return values.filter(value => value === objetivo).length;
}

function llenarDropdown(datosAcuario, parametro, valor, dropdownClass) {
    // Selecciona los dropdowns según el parámetro y la clase proporcionada
    const dropdowns = document.querySelectorAll(`#tarjeta${parametro} .${dropdownClass.classList[1]}`);

    if (parametro === "PH") parametro = "pH";
    if (parametro === "Temp") parametro = "temp";
    if (parametro === "InyeccCo2") parametro = "inyeccCO2";


    // Recorre los dropdowns y llena sus opciones
    dropdowns.forEach(dropdown => {
        // Limpia las opciones existentes
        dropdown.innerHTML = '<option value="">Seleccione fecha</option>';

        // Filtra los datos según el valor (ej. 'máximo', 'mínimo', etc.)
        const fechasFiltradas = datosAcuario
            .filter(dato => dato[parametro] === valor) // Filtra según el valor proporcionado
            .map(dato => dato.Fecha); // Obtiene solo las fechas

        // Agrega las opciones dinámicamente
        fechasFiltradas.forEach(fecha => {
            const option = document.createElement('option');
            option.value = fecha;
            option.textContent = fecha;
            dropdown.appendChild(option);
        });
    });
}

/**
 * Calcula la media de un array de valores
 * @param {Array<number>} valores - Valores
 * @returns {number} Media calculada
 */
function calcularMedia(valores) {
    return valores.reduce((sum, val) => sum + val, 0) / valores.length;
}

/**
 * Calcula la desviación estándar de un array de valores
 * @param {Array<number>} valores - Valores
 * @param {number} media - Media de los valores
 * @returns {number} Desviación estándar calculada
 */
function calcularDesviacion(valores, media) {
    return Math.sqrt(valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / valores.length);
}

function calcularTendenciaEsperada(valores) {
    const n = valores.length;
    if (n < 2) return { proximoValor: valores[0] || 0, interpretacion: "Insuficientes datos" };

    // Crear arrays para índices (x) y valores (y)
    const indices = Array.from({ length: n }, (_, i) => i + 1); // 1, 2, ..., n
    const sumX = indices.reduce((acc, val) => acc + val, 0);
    const sumY = valores.reduce((acc, val) => acc + val, 0);
    const sumXY = indices.reduce((acc, x, i) => acc + x * valores[i], 0);
    const sumX2 = indices.reduce((acc, x) => acc + Math.pow(x, 2), 0); // Reemplazamos x ** 2 por Math.pow(x, 2)

    // Fórmula de la pendiente (m) y la intersección (b) de y = mx + b
    const pendiente = (n * sumXY - sumX * sumY) / (n * sumX2 - Math.pow(sumX, 2)); // Reemplazamos sumX ** 2 por Math.pow(sumX, 2)
    const interseccion = (sumY - pendiente * sumX) / n;

    // Calcular el próximo valor esperado (proyección para x = n + 1)
    const proximoValor = pendiente * (n + 1) + interseccion;

    // Interpretar la tendencia con respecto al último valor
    const ultimoValor = valores[n - 1];
    const interpretacion =
        proximoValor > ultimoValor ? "Ascendente" :
        proximoValor < ultimoValor ? "Descendente" :
        "Estable";

    return {
        proximoValor: proximoValor.toFixed(1).replace('.', ','), // Formatear con un decimal y coma
        interpretacion
    };
}

//**************************************************** */
function calcularModa(valores) {
    // Calcula frecuencias
    const frecuencias = valores.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    // Encuentra el valor de la moda y la frecuencia máxima
    const [moda, repeticiones] = Object.entries(frecuencias)
        .reduce((a, b) => (b[1] > a[1] ? b : a));

    // Formatea el valor de la moda a un decimal con coma
    const modaFormateada = parseFloat(moda);

    // Retorna ambos valores como un objeto
    return {
        valor: modaFormateada,
        repeticiones: repeticiones
    };
}