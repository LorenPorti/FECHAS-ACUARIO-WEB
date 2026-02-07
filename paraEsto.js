// ParaEsto.js
export let numDelAcuario = null; // Inicializa la variable

export async function obtenerNumAcuario() {
    try {
        const response = await fetch("/acuarioActual.json");
        const numAcuarioActual = await response.json();
        numDelAcuario = numAcuarioActual[0].numAcuario; // Asigna el valor a la variable
        return numDelAcuario;
    } catch (error) {
        console.error("Error al obtener el número de acuario:", error);
        return null;
    }
}

export async function reiniciarDatos() {
    let reslt = await showModal("REINICIAR TODOS LOS CUADROS DE ENTRADAS", "» Al reiniciar todos los cuadros de entradas se limpiaran.\n\n" +
        "» EL texto que estuviera en algún cuadro de comentario se borrará.", "Reiniciar");
    if (!reslt) return;

    const inputs = document.querySelectorAll('textarea'); // Selecciona todos los inputs de comentarios
    inputs.forEach(input => input.value = ''); // Limpia cada textarea

    document.getElementById("acuarios").innerHTML = "&nbsp;";
    document.getElementById("dateInput").value = "";
    document.getElementById("phInput").value = "";
    document.getElementById("khInput").value = "";
    document.getElementById("tempInput").value = "";
    document.getElementById("no3Input").value = "";
    document.getElementById("plantas").innerHTML = "&nbsp;";
    document.getElementById("inyeccion").innerHTML = "&nbsp;";
    document.getElementById("agua").innerHTML = "&nbsp;";
    document.getElementById("algas").innerHTML = "&nbsp;";
    document.getElementById("superficie").innerHTML = "&nbsp;";

    // window.location.reload();
}

export async function procesarAcuariosJson() {
    // Carga los datos de acuarios.json y los muestra en el dropmenu
    try {
        const response = await fetch("./acuarios.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const acuarios = await response.json();
        document.getElementById("menuAcuarios").innerHTML = acuarios
            .map(
                (acuario) => `
            <li><a class="dropdown-item montserrat-medium-italic" href="#">(${acuario.Num}) ${acuario.Nombre}</a></li>
        `
            )
            .join("");

    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}

export function procesarAcuarios() {
    document
        .getElementById("menuAcuarios")
        .addEventListener("click", function(event) {
            document.getElementById("acuarios").textContent =
                event.target.textContent;
        });
}

export function procesarInyeccion() {
    document
        .getElementById("menuInyeccion")
        .addEventListener("click", function(event) {
            document.getElementById("inyeccion").textContent =
                event.target.textContent;
        });
}

export function procesarPlantas() {
    document
        .getElementById("menuPlantas")
        .addEventListener("click", function(event) {
            document.getElementById("plantas").textContent = event.target.textContent;
        });
}

export function procesarAgua() {
    document
        .getElementById("menuAgua")
        .addEventListener("click", function(event) {
            document.getElementById("agua").textContent = event.target.textContent;
        });
}

export function procesarAlgas() {
    document
        .getElementById("menuAlgas")
        .addEventListener("click", function(event) {
            document.getElementById("algas").textContent = event.target.textContent;
        });
}

export function procesarSup() {
    document
        .getElementById("menuSup")
        .addEventListener("click", function(event) {
            document.getElementById("superficie").textContent =
                event.target.textContent;
        });
}

// *************Enviar correo***************
//En el gestor de correos, por ejemplo en eM client, si se crea una carpeta DATOS CAMPO EMAIL en la cuenta gmail,
//y esta no está repetida en outlook, el correo enviado se descarga en la carpeta DATOS CAMPO EMAIL, aunque 
//esta no sea Outlook.
//Cuando en la página web (Código fuente), en index.html, se pone la siguiente línea
//document.getElementById("enviar").addEventListener("click", () => { enviarCorreo("outlook"); }); con la variante
//enviarCorreo("gmail"), se puede incluir en el texto los caracteres "\r\n", si esto ocurre se debe incluir el siguiente
//código acuario.Coment?.Replace("\r\n", " ")
let banderaError = false;
let CORREO_ELECTRONICO = "lorenporti@outlook.com";
export async function enviarCorreo(gestor) {

    if (gestor == "gmail") {
        CORREO_ELECTRONICO = "lorenporti47@gmail.com";
    }
    // Enviar correo usando EmailJS
    // Inicializar EmailJS
    let publicKey; // Tu publicKey de EmailJS
    let service; // Tu service de EmailJS
    let template;

    if (gestor == "outlook") {
        publicKey = "IZrWZg4ZaagQIFsUX"; // Tu publicKey de EmailJS
        service = "service_esxltkm"; // Tu service de EmailJS
        template = "template_i35yyct"; // Tu template de EmailJS
    }

    if (gestor == "gmail") {
        publicKey = "IZrWZg4ZaagQIFsUX"; // Tu publicKey de EmailJS
        service = "service_t6e0444"; // Tu service de EmailJS
        template = "template_hj2vaym"; // Tu template de EmailJS
    }

    emailjs.init(publicKey);

    // Recopilar datos
    const jsonData = {
        acuarioNum: document.getElementById("acuarios").textContent.substring(1, 2),
        tituloAcuario: document.getElementById("acuarios").textContent.substring(4),
        fecha: formatDate(document.getElementById("dateInput").value),
        pH: document.getElementById("phInput").value,
        KH: document.getElementById("khInput").value,
        temp: document.getElementById("tempInput").value,
        NO3: document.getElementById("no3Input").value,
        inyCO2: document.getElementById("inyeccion").textContent,
        plantas: document.getElementById("plantas").textContent,
        algas: document.getElementById("algas").textContent,
        agua: document.getElementById("agua").textContent,
        supAgua: document.getElementById("superficie").textContent,
        coment1: document.getElementById("comentario_1").value,
        coment2: document.getElementById("comentario_2").value,
        coment3: document.getElementById("comentario_3").value,
        coment4: document.getElementById("comentario_4").value,
        coment5: document.getElementById("comentario_5").value,
    };

    comprobrarDatos(jsonData);

    if (banderaError) {
        banderaError = false;
        return;
    }

    let objetoJson = JSON.stringify(
        jsonData,
        null,
        2
    ); /* let objetoJson = JSON.stringify(jsonData, null, 2); */

    let resultado = await showModal("CONTENIDO DEL CORREO", objetoJson, "Enviar Correo");
    if (!resultado) return;

    const templateParams = {
        message: objetoJson,
        to_email: CORREO_ELECTRONICO,
        subject: `Num. ${jsonData.acuarioNum} «${
      jsonData.tituloAcuario
    }» - ${transformarFecha(jsonData.fecha)}`,
    };

    emailjs
        .send(service, template, templateParams) // Reemplaza con tu Service ID y Template ID
        .then(
            function(response) {
                console.log("SUCCESS!", response.status, response.text);
                // alert(`Email enviado correctamente a «${CORREO_ELECTRONICO}».`);
                showModal("ENVÍO DEL EMAIL", `Enviado a la carpeta 'DATOS CAMPO EMAIL'.`, null);
            },
            function(error) {
                console.log("FAILED...", error);
                // alert("Fallo en el envío del correo.");
                showModal("FALLO EN EL EMAIL", "Fallo en el envío del correo.", null);
            }
        );
}

//*************OBTENER CORREOS************************/
export async function obtenerCorreo() {
    await showModal(
        "LISTA DE CORREOS ENVIADOS",
        "muchos correos",
        "Correos Enviados"
    );

}


export async function guardarDatos() {
    //Comprobar la conexióna internet
    if (!navigator.onLine) {
        await showModal("NO HAY CONEXIÓN", "No hay conexión a internet.", null);
        return;
    }

    // const dispositivo = detectarDispositivo();
    // let txtAdd;
    // if (dispositivo == "escritorio") {
    //     txtAdd =
    //         "\n\n" +
    //         "<hr>" +
    //         '» Si la aplicación es de escritorio, los datos se guardaran en un archivo llamado "temporal.json". Sobre escribirlo si existe.'; //Este mensaje se ve solo si la página la muestra un navegador de escritorio
    // } else {
    //     txtAdd = "";
    // }

    let resultado = await showModal(
        "GUARDAR DATOS ACTUALES",
        "» Los datos actuales tal como están en sus cuadros de entradas, se guardaran en la base de datos. Estos datos se pueden recuperar con la opción del menú «Recuperar datos»." +
        "<br>" +
        "<br>" +
        "» Se guardan en la nube de la base de datos 'JSONBin'.",
        /*  +
                            txtAdd, */
        "Guardar datos",
    );
    if (!resultado) return;

    // Recopilar datos
    let fecha;
    if (document.getElementById("dateInput").value == "NaN") {
        fecha = "";
    } else {
        fecha = document.getElementById("dateInput").value;
    }
    const jsonData = {
        acuarioNum: document.getElementById("acuarios").textContent.substring(1, 2),
        tituloAcuario: document.getElementById("acuarios").textContent.substring(4),
        fecha: fecha,
        pH: document.getElementById("phInput").value,
        KH: document.getElementById("khInput").value,
        temp: document.getElementById("tempInput").value,
        NO3: document.getElementById("no3Input").value,
        inyCO2: document.getElementById("inyeccion").textContent,
        plantas: document.getElementById("plantas").textContent,
        algas: document.getElementById("algas").textContent,
        agua: document.getElementById("agua").textContent,
        supAgua: document.getElementById("superficie").textContent,
        coment1: document.getElementById("comentario_1").value,
        coment2: document.getElementById("comentario_2").value,
        coment3: document.getElementById("comentario_3").value,
        coment4: document.getElementById("comentario_4").value,
        coment5: document.getElementById("comentario_5").value,
    };

    guardarTemporalJSONBin(jsonData, binID);
    // if (dispositivo == "escritorio") {
    //     GuardarDatosTemporales(jsonData);
    // } else {
    //     // Convertir jsonData a string y guardarlo en el Local Storage
    //     localStorage.setItem('datosAcuario', JSON.stringify(jsonData));
    // }

    // await showModal("GUARDAR DATOS", "» Los datos contenidos en los inputs se han guardado.\n\n" +
    //     "» Usar «Recuperar Datos» para recargarlos." +
    //     txtAdd, null);

    setTimeout(() => {
        alert("Los datos se han guardado correctamente");
    }, 100);
}

export async function recuperarDatos() {
    // let txtAdd = "";
    // const dispositivo = detectarDispositivo();
    // // console.log("Dispositivo:", dispositivo);    
    // // if (dispositivo == "escritorio") {
    // //     txtAdd =
    // //         "\n\n" +
    // //         "<hr>" +
    // //         '» Los datos estan guardados en un archivo "temporal.json".';
    // // } else {
    // //     txtAdd = "";
    // // } 

    // let valorDatosGuardados;
    // let datosGuardados;
    // // Recuperar los datos guardados
    // if (dispositivo == "movil") {
    //     datosGuardados = localStorage.getItem("datosAcuario");
    //     if (datosGuardados == null) {
    //         await showModal("RECUPERAR VACÍO", "No existen datos para recuperar", null);
    //         return;
    //     }
    //     valorDatosGuardados = JSON.parse(datosGuardados);
    // } else {

    //     await showModal("RECUPERAR DATOS PROVISIONALES", 'Los datos provisionales estan guardados en un archivo llamado "temporal.json"');

    //     try {
    //         valorDatosGuardados = await recuperarDatosTemporales(); // Esperar a que los datos se recuperen            
    //     } catch (error) {
    //         console.error("Error al recuperar los datos temporales:", error);
    //         return; // Salir si hay un error
    //     }
    // }

    //Comprobar la conexióna internet
    if (!navigator.onLine) {
        await showModal("NO HAY CONEXIÓN", "No hay conexión a internet.", null);
        return;
    }

    const valorDatosGuardados = await leerTemporalJSONBin(binID);

    let resultado = await showModal(
        "RECUPERAR DATOS",
        "» A continuación se ven los datos que se han guardado con la opción «Guardar datos»,  estos actualizarán y sustituirán a los actuales en sus cuadros de entradas correspondientes. Incluso los datos vacíos.\n" +
        "<hr>" /* <hr> línea de separación */ +
        "<p class='georgia-black-italic text-black'>" +
        "Número del acuario: (" + valorDatosGuardados.acuarioNum + ")<br>" +
        `Título del acuario: ${valorDatosGuardados.tituloAcuario}` + "<br>" +
        `Fecha: ${valorDatosGuardados.fecha ? convertirFecha(valorDatosGuardados.fecha) : ""}` + "<br>" + // Condición para la fecha
        "» (pH = " + valorDatosGuardados.pH + ") » (NO3 = " + valorDatosGuardados.NO3 + ") » (KH = " + valorDatosGuardados.KH + ") » (Temp = " + valorDatosGuardados.temp + ")<br>" + "» (Iny. CO2 = " + valorDatosGuardados.inyCO2 + ") » (Plantas = " + valorDatosGuardados.plantas + ")<br> " +
        "» (Agua = " + valorDatosGuardados.agua + ") » (Algas = " + valorDatosGuardados.algas + ")<br> " +
        "» (Sup. Agua = " + valorDatosGuardados.supAgua + ")<br> " +
        "» Coment. 1: " + valorDatosGuardados.coment1 + "<br>" +
        "» Coment. 2: " + valorDatosGuardados.coment2 + "<br>" +
        "» Coment. 3: " + valorDatosGuardados.coment3 + "<br>" +
        "» Coment. 4: " + valorDatosGuardados.coment4 + "<br>" +
        "» Coment. 5: " + valorDatosGuardados.coment5 + "<br>" +
        "</p>",
        /* +
               txtAdd, */
        "Recuperar datos"
    );

    if (!resultado) return;

    // Si existen datos, cargarlos en el formulario
    if (valorDatosGuardados) {

        if (valorDatosGuardados.acuarioNum != "") {
            document.getElementById("acuarios").textContent =
                "(" + valorDatosGuardados.acuarioNum + ") " + valorDatosGuardados.tituloAcuario;
        } else {
            document.getElementById("acuarios").innerHTML = "&nbsp;";
        }
        document.getElementById("dateInput").value = valorDatosGuardados.fecha;
        document.getElementById("phInput").value = valorDatosGuardados.pH;
        document.getElementById("khInput").value = valorDatosGuardados.KH;
        document.getElementById("tempInput").value = valorDatosGuardados.temp;
        document.getElementById("no3Input").value = valorDatosGuardados.NO3;
        document.getElementById("inyeccion").textContent = valorDatosGuardados.inyCO2;
        document.getElementById("plantas").textContent = valorDatosGuardados.plantas;
        document.getElementById("algas").textContent = valorDatosGuardados.algas;
        document.getElementById("agua").textContent = valorDatosGuardados.agua;
        document.getElementById("superficie").textContent = valorDatosGuardados.supAgua;
        document.getElementById("comentario_1").value = valorDatosGuardados.coment1;
        document.getElementById("comentario_2").value = valorDatosGuardados.coment2;
        document.getElementById("comentario_3").value = valorDatosGuardados.coment3;
        document.getElementById("comentario_4").value = valorDatosGuardados.coment4;
        document.getElementById("comentario_5").value = valorDatosGuardados.coment5;
    }
}

//************************Declaración claves JSONBin.io**************************************
const X_Master_Key = '$2a$10$N0MHs1suhD6p8MLMuXbelOwaype8bzrs6PqIXNBfbIpgF0pxL5E6S'; //X-Master-Key JSONBin
const binID = '67504127acd3cb34a8b3dd0c';

function guardarTemporalJSONBin(datos, binID) {
    const url = `https://api.jsonbin.io/v3/b/${binID}`; // URL para actualizar un bin existente
    const headers = {
        'Content-Type': 'application/json',
        'X-Master-Key': X_Master_Key // Sustituye con tu X-Master-Key
    };

    // Convertimos los datos en formato JSON antes de enviarlos
    const body = JSON.stringify(datos);

    fetch(url, {
            method: 'PUT', // Método para actualizar un bin existente
            headers: headers,
            body: body // Los datos que vamos a guardar
        })
        .then(response => response.json())
        .then(data => {
            console.log('Bin actualizado con éxito:', data);
        })
        .catch(error => {
            console.error('Error al actualizar el archivo temporal:', error);
        });
}

export async function leerTemporalJSONBin(binID) {
    const url = `https://api.jsonbin.io/v3/b/${binID}`; // URL con el Bin ID
    const headers = {
        'Content-Type': 'application/json',
        'X-Master-Key': X_Master_Key // Sustituye con tu X-Master-Key
    };

    try {
        const response = await fetch(url, {
            method: 'GET', // Método para obtener el bin
            headers: headers
        });
        const data = await response.json();
        console.log('Datos obtenidos del bin:', data.record);
        return data.record;
    } catch (error) {
        console.error('Error al leer el archivo temporal:', error);
        throw error; // Lanza el error para manejarlo en otro lugar si es necesario
    }
}

function detectarDispositivo() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("android") || userAgent.includes("iphone") || userAgent.includes("ipad")) {
        return "movil"; // Dispositivo móvil
    } else {
        return "escritorio"; // Dispositivo de escritorio
    }
}

// Función para guardar los datos como un archivo JSON
function GuardarDatosTemporales(datosTemporales) {

    let jsonStr = JSON.stringify(datosTemporales, null, 2);
    let blob = new Blob([jsonStr], { type: "application/json" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "temporal.json"; // Nombre del archivo que se descarga
    link.click();
}

// Función para recuperar datos desde un archivo JSON
function recuperarDatosTemporales() {
    return new Promise((resolve, reject) => {
        // Crear el input file de manera programática
        let archivoInput = document.createElement('input');
        archivoInput.type = 'file';
        archivoInput.accept = '.json'; // Solo archivos JSON

        // Simular el clic en el input para abrir el diálogo de selección de archivos
        archivoInput.click();

        // Escuchar cuando se seleccione un archivo
        archivoInput.addEventListener('change', function() {
            const file = archivoInput.files[0]; // Obtener el archivo seleccionado

            if (file) {
                // Verificar si el nombre del archivo es "temporal.json"
                if (file.name === "temporal.json") {
                    const reader = new FileReader();

                    // Leer el contenido del archivo
                    reader.onload = function(e) {
                        const contenidoArchivo = e.target.result;

                        // Parsear el archivo como JSON
                        try {
                            const datos = JSON.parse(contenidoArchivo);
                            console.log('Datos JSON cargados:', datos);
                            resolve(datos); // Devolver los datos JSON
                        } catch (error) {
                            console.error('Error al parsear JSON:', error);
                            reject('Error al parsear JSON'); // Rechazar la promesa en caso de error
                        }
                    };

                    // Leer el archivo como texto
                    reader.readAsText(file);
                } else {
                    showModal("NOMBRE DEL ARCHIVO", 'El archivo seleccionado debe ser "temporal.json".', null);
                    reject('Archivo no válido'); // Rechazar si el archivo no es "temporal.json"
                }
            } else {
                showModal("ERROR ARCHIVO", 'No se seleccionó ningún archivo.', null);
                reject('No se seleccionó archivo'); // Rechazar si no se selecciona archivo
            }
        });
    });
}

// Convierte un valor Date al formato "17 jul 2024"
export function formatDate(dateString) {
    // Convertir la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    const months = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}


// convierte un valor de la forma "17 jul 2024" a Date
export function parseDateString(dateString) {
    const months = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
    ];
    const [day, month, year] = dateString.split(" ");

    const monthIndex = months.indexOf(month.toLowerCase());

    if (monthIndex === -1) {
        return null;
    }

    const date = new Date(year, monthIndex, day);

    return {
        dateObject: date,
        milliseconds: date.getTime(),
    };
}

// Convierte un valor de la forma "4 ago 2024" a "2024-08-04"
function transformarFecha(dateString) {
    const months = {
        "ene": "01",
        "feb": "02",
        "mar": "03",
        "abr": "04",
        "may": "05",
        "jun": "06",
        "jul": "07",
        "ago": "08",
        "sep": "09",
        "oct": "10",
        "nov": "11",
        "dic": "12"
    };

    const [day, month, year] = dateString.split(" ");

    const formattedMonth = months[month.toLowerCase()];

    // Asegura que el día tiene dos dígitos
    const formattedDay = day.padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay}`;
}

//Convierte un valor de la forma  "2024-08-04" a "4 ago 2024"
function convertirFecha(fecha) {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    // Crear un objeto Date a partir de la cadena de fecha
    const date = new Date(fecha);

    // Obtener el día, mes y año
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();

    // Formatear la fecha como "4 ago 2024"
    return `${dia} ${mes} ${anio}`;
}

// Función para mostrar el modal y devolver una promesa que se resuelve con true o false
// Si se pone a null el botonAvanzar solo se muestra el boton cancelar con el texto "Vale"
function showModal(title, message, botonAvanzar) {
    return new Promise((resolve) => {
        // Actualiza el título y el contenido del modal
        document.getElementById("modalLabel").innerText = title;
        document.querySelector(".modal-body").innerHTML = message;
        if (botonAvanzar != null) {
            document.getElementById("sendEmailButton").hidden = false;
            document.getElementById("sendEmailButton").innerText = botonAvanzar;
            document.getElementById("sendEmailButton").classList.remove('btn-secondary');
            document.getElementById("sendEmailButton").classList.add('btn-primary');
            document.getElementById("cancelButton").classList.remove('btn-primary');
            document.getElementById("cancelButton").classList.add('btn-secondary');
            document.getElementById("cancelButton").innerText = "Cancelar";
        } else {
            document.getElementById("sendEmailButton").hidden = true;
            document.getElementById("cancelButton").innerText = "Vale";
            document.getElementById("cancelButton").classList.remove('btn-secondary');
            document.getElementById("cancelButton").classList.add('btn-primary');
        }

        // Muestra el modal
        const modal = new bootstrap.Modal(document.getElementById("customModal"));
        modal.show();

        // Manejador de eventos para el botón "Enviar correo"
        document
            .getElementById("sendEmailButton")
            .addEventListener("click", function() {
                modal.hide();
                resolve(true); // Resuelve la promesa con true
            });

        // Manejador de eventos para el botón "Cancelar"
        document
            .getElementById("cancelButton")
            .addEventListener("click", function() {
                modal.hide();
                resolve(false); // Resuelve la promesa con false
            });
    });
}

function comprobrarDatos(objeto) {
    if (objeto.acuarioNum == "" || objeto.tituloAcuario == "") {
        banderaError = true;
        // alert("No se ha seleccionado ningun acuario.");
        showModal("ERROR ENTRADA", "No se ha seleccionado ningun acuario.", null);
        return;
    }

    const fecha = parseDateString(objeto.fecha);

    if (fecha === null) {
        banderaError = true;
        // alert("La fecha es incorrecta.");
        showModal("ERROR ENTRADA", "La fecha es incorrecta.", null);
        return;
    }
    if (fecha.milliseconds > Date.now()) {
        banderaError = true;
        // alert("La fecha no puede ser posterior a la actual.");
        showModal("ERROR ENTRADA", "La fecha no puede ser posterior a la actual.", null);
        return;
    }
    if (fecha.dateObject.getDay() != 0) {
        banderaError = true;
        // alert("La fecha tiene que ser domingo.");
        showModal("ERROR ENTRADA", "La fecha tiene que ser domingo.", null);
        return;
    }
    if (objeto.pH == "") {
        banderaError = true;
        // alert("Falta el pH.");
        showModal("ERROR ENTRADA", "Falta el pH.", null);
        return;
    }
    if (parseFloat(objeto.pH) < 4 || parseFloat(objeto.pH) > 10) alert("El valor del pH debe estar entre 4 y 10.");
    if (objeto.KH == "") {
        banderaError = true;
        // alert("Falta el KH.");
        showModal("ERROR ENTRADA", "Falta el KH.", null);
        return;
    }
    if (parseFloat(objeto.KH) < 0 || parseFloat(objeto.KH) > 30) alert("El valor del KH debe estar entre 0 y 30.");
    if (objeto.temp == "") {
        banderaError = true;
        // alert("Falta la temperatura.");
        showModal("ERROR ENTRADA", "Falta la temperatura.", null);
        return;
    }
    if (parseInt(objeto.temp) < 5 || parseInt(objeto.temp) > 40) alert("El valor de la tempeartura debe estar entre 5ºC y 40ºC.");
    if (objeto.NO3 == "") {
        banderaError = true;
        // alert("Falta el valor del nitrato.");
        showModal("ERROR ENTRADA", "Falta el valor del nitrato.", null);
        return;
    }
    if (parseInt(objeto.NO3) < 0 || parseInt(objeto.NO3) > 100) alert("El valor del NO3 debe estar entre 0 y 100.");
    if (objeto.inyCO2.trim() == "") {
        banderaError = true;
        // alert("Falta el tipo de inyección de CO2.");
        showModal("ERROR ENTRADA", "Falta el tipo de inyección de CO2.", null);
        return;
    }
    if (objeto.plantas.trim() == "") {
        banderaError = true;
        // alert("Falta el estado de las plantas.");
        showModal("ERROR ENTRADA", "Falta el estado de las plantas.", null);
        return;
    }
    if (objeto.agua.trim() == "") {
        banderaError = true;
        // alert("Falta el estado del agua.");
        showModal("ERROR ENTRADA", "Falta el estado del agua.", null);
        return;
    }
    if (objeto.algas.trim() == "") {
        banderaError = true;
        // alert("Falta el estado de las algas.");
        showModal("ERROR ENTRADA", "Falta el estado de las algas.", null);
        return;
    }
    if (objeto.supAgua.trim() == "") {
        banderaError = true;
        // alert("Falta el estado de la superficie del agua.");
        showModal("ERROR ENTRADA", "Falta el estado de la superficie del agua.", null);
        return;
    }
}