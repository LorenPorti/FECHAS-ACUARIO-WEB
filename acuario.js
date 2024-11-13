import { formatDate, parseDateString } from "./paraEsto.js";

// Función para cargar los datos de configuración en el formulario
function cargarConfiguracion() {

    const storedDataConfig = localStorage.getItem('dataConfig');
    let numAcuario = localStorage.getItem('numAcuario');

    dataConfig = JSON.parse(storedDataConfig); // Convertir JSON a objeto

    // Accedemos al formulario en configuracion.html
    document.getElementById('nombreDelAcuario').value = `(${numAcuario}) ${dataConfig.nombreDelAcuario}` || '';
    document.getElementById('fechaInicial').value = dataConfig.fechaInicial.split('T')[0] || '';
    // document.getElementById('fechaFinal').value = dataConfig.fechaFinal.split('T')[0] || '';
    document.getElementById('pHOpt').value = dataConfig.pHOpt || '';
    document.getElementById("KHOpt").value = `${dataConfig.KHOpt} (dKH)` || "";
    document.getElementById('tempOpt').value = `${dataConfig.tempOpt} ºC` || '';
    document.getElementById('dimensionesAcuario').value = `${dataConfig.largoAcuario} x ${dataConfig.anchoAcuario} x ${dataConfig.altoAcuario}` || '';
    document.getElementById('volumenAcuario').value = `${Number(dataConfig.largoAcuario*dataConfig.anchoAcuario*dataConfig.altoAcuario/1000).toFixed(0)} lt` || '';
}

// Llamamos a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarConfiguracion);