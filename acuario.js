import { formatDate, parseDateString } from "./paraEsto.js";

// Función para cargar los datos de configuración en el formulario
function cargarConfiguracion() {

    const storedDataConfig = localStorage.getItem('dataConfig');
    let numAcuario = localStorage.getItem('numAcuario');

    dataConfig = JSON.parse(storedDataConfig); // Convertir JSON a objeto
    const storedDatosAcuario = localStorage.getItem('datosAcuario');
    datosAcuario = JSON.parse(storedDatosAcuario);

    // Accedemos al formulario en configuracion.html
    document.getElementById('nombreDelAcuario').value = `(${numAcuario}) ${dataConfig.nombreDelAcuario}` || '';
    document.getElementById('fechaInicial').value = `${datosAcuario[0].Fecha}/${datosAcuario[datosAcuario.length - 1].Fecha}  Datos = ${addThousandsSeparatorManual((datosAcuario.length))}` || '';
    document.getElementById('pHOpt').value = `${dataConfig.pHOpt.toString().replace('.', ',')}  -media = ${ValorMedio("pH").toString().replace('.', ',')}-` || '';
    document.getElementById("KHOpt").value = `${dataConfig.KHOpt.toString().replace('.', ',')} (dKH)  -media = ${ValorMedio("KH").toString().replace('.', ',')} (dKH)-` || "";
    document.getElementById('tempOpt').value = `${dataConfig.tempOpt.toString().replace('.', ',')} ºC  -media = ${ValorMedio("temperatura").toString().replace('.', ',')} ºC-` || '';
    document.getElementById('dimensionesAcuario').value = `${dataConfig.largoAcuario} x ${dataConfig.anchoAcuario} x ${dataConfig.altoAcuario}` || '';
    document.getElementById('volumenAcuario').value = `${Number(dataConfig.largoAcuario*dataConfig.anchoAcuario*dataConfig.altoAcuario/1000).toFixed(0)} lt` || '';
}

function ValorMedio(elemento) {

    let suma = 0;
    switch (elemento) {
        case "pH":
            datosAcuario.forEach(elem => {
                suma += elem.pH;
            });
            break;
        case "KH":
            datosAcuario.forEach(elem => {
                suma += elem.KH;
            });
            break;
        case "temperatura":
            datosAcuario.forEach(elem => {
                suma += elem.temp;
            });
            break;
    }

    return (suma / datosAcuario.length).toFixed(1);
}

function addThousandsSeparatorManual(numero) {
    let [integerPart, decimalPart] = numero.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Añade puntos a miles
    return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
}

// Llamamos a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarConfiguracion);